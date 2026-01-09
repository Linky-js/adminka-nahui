<script setup>
import { reactive, computed, defineProps, ref, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from "axios";
import { entityConfigs } from '@/configs/entityConfigs';
import { useAppStore } from '@/stores/useAppStore'
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

// Компоненты форм
import Editor from '@/components/blocks/form/EditorNews.vue';
import BaseInput from '@/components/blocks/form/BaseInput.vue';
import BaseFileInput from '@/components/blocks/form/BaseFileInput.vue';
import BaseTextarea from '@/components/blocks/form/BaseTextarea.vue';
import BaseSelect from '@/components/blocks/form/BaseSelect.vue';
import BaseDatePicker from '@/components/blocks/form/BaseDatePicker.vue';
import BaseCoords from '@/components/blocks/form/KoordinatesVal.vue';
import DragImages from '@/components/blocks/form/DragImages.vue';
import TestElement from '@/components/blocks/form/TestElement.vue';


// props
const props = defineProps({
  entity: { type: String, required: true },
  initialData: { type: Object, default: () => ({}) },
});

const router = useRouter();

// refs
const isCalendarVisible = ref(false);
const formattedDate = ref("Выберите дату");
const dateRange = ref(null);
const fieldOptions = reactive({}); // сюда складываем options для селектов: fieldOptions[fieldKey] = [{value,label},...]
// const isSaving = ref(false);

// вспомогательные refs для хранения "сырых" списков (если нужно)
const categoriesRaw = ref([]);
const regionsRaw = ref([]);

// store-derived values
const store = useAppStore()
const user = store.user
const apiUrl = store.apiUrl

// computed
const config = computed(() => {
  const val = store.entities ? store.entities[props.entity] : undefined
  if (Array.isArray(val)) return val
  if (val && typeof val === 'object' && Array.isArray(val.fields)) return val.fields
  return entityConfigs[props.entity] || []
})

// form data
const formData = reactive({});

// ---------------------- INIT ----------------------
function getDefaultValue(type) {
  switch (type) {
    case 'input':
    case 'textarea':
    case 'editor':
    case 'select':
    case 'date':
      return '';
    case 'file':
      return '';
    case 'images':
      return [];
    case 'coords':
      return { lat: '', lng: '' };
    default:
      return '';
  }
}
function resolveValueFromSource(data, srcKey) {
  if (!data) return undefined;
  if (data[srcKey] !== undefined) return data[srcKey];

  // если sourceKey = something_id и в data есть object 'something' с id
  if (srcKey && srcKey.endsWith('_id')) {
    const objKey = srcKey.replace('_id', '');
    const maybeObj = data[objKey];
    if (maybeObj && typeof maybeObj === 'object') {
      if (maybeObj.id !== undefined) return maybeObj.id;
      if (Array.isArray(maybeObj) && maybeObj[0] && maybeObj[0].id !== undefined) return maybeObj[0].id;
    }
  }

  // если sourceKey содержит точку 'user.name' (возможность расширить)
  if (srcKey && srcKey.includes('.')) {
    const parts = srcKey.split('.');
    let cur = data;
    for (const p of parts) {
      if (!cur) return undefined;
      cur = cur[p];
    }
    return cur;
  }

  return undefined;
}
async function loadInitialData() {
  if (props.initialData && typeof props.initialData === 'object' && props.initialData.id && Object.keys(props.initialData).length === 1) {
    // Если initialData имеет только id, загрузим полные данные
    const authGet = `&auth=${user.username}:${user.auth_key}`;
    let endpoint = `${apiUrl}api-${props.entity}/get-admin-list${authGet}&id=${props.initialData.id}`;
    try {
      const response = await axios.get(endpoint);
      if (response.data && response.data[props.entity] && response.data[props.entity].length > 0) {
        // Предполагаем, что API возвращает объект в массиве
        const fullData = response.data[props.entity][0];
        // Обновим initialData, но поскольку это prop, лучше напрямую использовать в initForm
        // Или сделать reactive initialData
        // Для простоты, вызовем initForm с fullData
        initFormWithData(fullData);
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  } else {
    initForm();
  }
}

function initFormWithData(data) {
  config.value.forEach((field) => {
    const srcKey = field.sourceKey || field.key;
    const maybe = resolveValueFromSource(data, srcKey);
    const value = maybe !== undefined ? maybe : getDefaultValue(field.type);

    // адаптация формата для images/image
    if (field.type === 'images' && Array.isArray(maybe)) {
      formData[field.key] = maybe.map(v => ({ id: Date.now() + Math.random(), url: v, isExisting: true }));
    } else if (field.type === 'image' && typeof maybe === 'string' && maybe) {
      formData[field.key] = { id: Date.now(), url: maybe, isExisting: true };
    } else {
      formData[field.key] = value;
    }
  });

  // дополнительная страховка: если в data есть вложенный category/region объекты, выставим соответствующие ключи
  config.value.forEach(field => {
    const tKey = field.key;
    const src = field.sourceKey || field.key;
    if ((src === 'category_id' || tKey === 'categorieId') && data) {
      const catVal = resolveValueFromSource(data, 'category_id') ?? resolveValueFromSource(data, 'category');
      if (catVal !== undefined) formData[tKey] = catVal;
    }
    if ((src === 'region_id' || tKey === 'regionId') && data) {
      const regVal = resolveValueFromSource(data, 'region_id') ?? resolveValueFromSource(data, 'region');
      if (regVal !== undefined) formData[tKey] = regVal;
    }
  });
}

function initForm() {
  initFormWithData(props.initialData);
}

onMounted(async () => {
  console.log('props.', props.entity);

  await loadInitialData();
  getDynamicOptions();
});

// Следим за изменением initialData (например, при редактировании)
watch(() => props.initialData, async (newData) => {
  await loadInitialData();
}, { deep: true });
watch(() => props.entity, (val) => {
  console.log('props.entity', val);

});

// ---------------------- COMPONENTS MAP ----------------------
function getComponent(type) {
  const map = {
    input: BaseInput,
    file: BaseFileInput,
    textarea: BaseTextarea,
    select: BaseSelect,
    date: BaseDatePicker,
    coords: BaseCoords,
    images: DragImages,
    editor: Editor,
    test: TestElement,
  };
  return map[type] || BaseInput;
}

// ---------------------- OPTIONS LOADING ----------------------
async function getDynamicOptions() {
  // темы
  const needsTheme = config.value.some(f => (f.sourceKey || f.targetKey || f.key) === 'theme_id' || f.key === 'theme');
  if (needsTheme) await getThemes();

  // категории (ищем конфигные поля, которые связаны с category_id / categorieId)
  const needsCategory = config.value.some(f => {
    const src = f.sourceKey || f.targetKey || '';
    return src === 'category_id' || f.key === 'categorieId' || src.includes('category');
  });
  if (needsCategory) await getCategories();

  // регионы (обычно для object)
  const needsRegions = config.value.some(f => {
    const src = f.sourceKey || f.targetKey || '';
    return src === 'region_id' || f.key === 'regionId';
  });
  if (needsRegions) await getRegions();
}

async function getThemes() {
  try {
    const authGet = `&auth=${user.username}:${user.auth_key}`;
    const response = await axios.get(`${apiUrl}api-theme/get-list${authGet}`);
    const themes = response.data.themes || [];

    fieldOptions.theme = themes.map(t => ({
      value: t.id,
      label: t.name,
    }));

    if (props.initialData?.theme?.id) {
      formData.theme = props.initialData.theme.id;
    }
  } catch (err) {
    console.error("Ошибка при загрузке тем:", err);
  }
}

async function getCategories() {
  try {
    const authGet = `&auth=${user.username}:${user.auth_key}`;
    // endpoint формируем по шаблону: api-${entity}-category/get-list
    let link = props.entity.includes('1banner') ? props.entity.slice(0, -7) : props.entity;
    const endpoint = `${apiUrl}api-${link}-category/get-list${authGet}`;
    const response = await axios.get(endpoint);
    // backend у тебя возвращал либо response.data.categories, либо response.data.object_categories
    const cats = response.data.categories || response.data.object_categories || [];
    categoriesRaw.value = cats;

    // Преобразуем в массив {value,label}
    // Возможные структуры: {id, name} или {category_id, title} — пробуем наиболее частые
    const options = cats.map(c => {
      if (c.id !== undefined && (c.name || c.title || c.title_ru)) {
        return { value: c.id, label: c.name || c.title || c.title_ru || c.name_ru };
      }
      // fallback — если структура иная, берём первое числовое поле как id и строковое как label
      const keys = Object.keys(c);
      const idKey = keys.find(k => k.toLowerCase().includes('id')) || keys[0];
      const labelKey = keys.find(k => ['name', 'title', 'label'].includes(k)) || keys[1] || keys[0];
      return { value: c[idKey], label: c[labelKey] };
    });


    // находим поле конфигурации, куда нужно подставить опции — обычно key = 'categorieId' или sourceKey = 'category_id'
    config.value.forEach(field => {
      const src = field.sourceKey || field.targetKey || field.key;
      if (src === 'category_id' || field.key === 'categorieId' || src.includes('category')) {

        fieldOptions[field.key] = options;
        // если редактируем и initialData имеет category или category_id — выставляем
        const initialCat = resolveValueFromSource(props.initialData, 'category_id') ?? resolveValueFromSource(props.initialData, 'category');
        if (initialCat !== undefined) {
          formData[field.key] = initialCat;
        }
      }
    });



  } catch (err) {
    console.error("Ошибка при загрузке категорий:", err);
  }
}

async function getRegions() {
  try {
    const authGet = `&auth=${user.username}:${user.auth_key}`;
    const response = await axios.get(`${apiUrl}api-object-region/get-list${authGet}`);
    const regs = response.data.object_regions || [];
    regionsRaw.value = regs;

    const options = regs.map(r => ({ value: r.id, label: r.name || r.title || r.region_name || r.name_ru }));

    // подставляем в поле regionId если есть в конфиге
    config.value.forEach(field => {
      const src = field.sourceKey || field.targetKey || field.key;
      if (src === 'region_id' || field.key === 'regionId') {
        fieldOptions[field.key] = options;
        const initialReg = resolveValueFromSource(props.initialData, 'region_id') ?? resolveValueFromSource(props.initialData, 'region');
        if (initialReg !== undefined) formData[field.key] = initialReg;
      }
    });
  } catch (err) {
    console.error("Ошибка при загрузке регионов:", err);
  }
}

function getFieldProps(field) {
  const p = field.props || {};
  // для любого select мы пробуем взять опции из fieldOptions[field.key]
  if ((field.type === 'select' || (p && p.options)) && fieldOptions[field.key]) {
    return { ...p, options: fieldOptions[field.key] || [] };
  }
  // остальные просто прокидываем
  return p;
}

// ---------------------- SAVE ENTITY ----------------------
async function uploadFile(input, type) {
  if (!input) return null;

  let file = null;

  if (input instanceof File) {
    file = input;
  } else if (typeof input === "object" && input.file instanceof File) {
    file = input.file;
  } else if (input.target?.files?.[0]) {
    file = input.target.files[0];
  }

  if (!file) {
    console.warn("uploadFile: не нашли файл для загрузки", input);
    return null;
  }

  // const validFileTypes = {
  //   image: ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"],
  //   document: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
  //   // добавьте другие типы файлов здесь
  // };

  // if (!validFileTypes[type].includes(file.type)) {
  //   alert(`Можно загружать только ${type} файлы.`);
  //   return null;
  // }

  const fd = new FormData();
  fd.append("UploadForm[file]", file);
  fd.append("folder", type === "image" ? "images/img" : "documents");
  fd.append("filenamePrefix", type === "image" ? "img_" : "doc_");

  const authGet = `&auth=${user.username}:${user.auth_key}`;

  try {
    const res = await axios.post(apiUrl + "upload" + authGet, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    const d = res.data;
    if (!d) return null;
    return d.path || d.url || d.file || d; // универсально
  } catch (err) {
    console.error("Ошибка uploadFile:", err);
    throw err;
  }
}

// buildParamsFromConfig
async function buildParamsFromConfig(config, formDataLocal) {
  try {
    const params = {};
    params.date_add = new Date();

    for (const field of config) {


      const key = field.sourceKey || field.key;
      const value = formDataLocal[field.key];

      // --- Пропускаем undefined
      if (value === undefined) continue;

      // --- Если поле не изображение
      if (field.type !== "images" && field.type != "file") {
        params[key] = value;
        console.log('field', field.type, value);
        continue;
      }

      // --- Обработка изображений (single / multiple)
      if (!value) {
        params[key] = null;
        continue;
      }

      // --- Если массив (множественные изображения)
      if (Array.isArray(value)) {
        const uploadedList = [];

        for (const item of value) {
          console.log('item', item);
          // если это уже существующая картинка — не грузим
          if (item.isExisting && (item.url || item.path)) {
            uploadedList.push(item.url?.img || item.url || item.path);
            continue;
          }

          // если есть File или dataurl — грузим
          const uploaded = await uploadFile(item);
          if (uploaded) uploadedList.push(uploaded);
        }

        params[key] = uploadedList.length > 1 ? uploadedList : uploadedList[0];
        continue;
      }

      // --- Если не массив (одиночное изображение)
      if (typeof value === "string") {
        params[key] = value;
        continue;
      }

      if (value.isExisting && (value.url || value.path)) {
        params[key] = value.url || value.path;
        continue;
      }

      const uploaded = await uploadFile(value);
      params[key] = uploaded;
    }

    return params;
  } catch (error) {
    console.error("Ошибка при формировании параметров:", error);
    return {};
  }
}



async function saveEntity() {
  const authGet = `&auth=${user.username}:${user.auth_key}`;
  const isUpdate = !!props.initialData?.id;
  let link = '';
  console.log('formdata', formData);

  // определяем endpoint
  if (props.entity.includes('1category')) {
    link = props.entity.slice(0, -9) + '-category';
  } else {
    link = props.entity;
    if (props.entity.includes('1banner')) {
      link = props.entity.slice(0, -7) + '-banner';
    }
  }

  const endpoint = `api-${link}/${isUpdate ? 'update' : 'set'}`;
  const configCurrent = entityConfigs[props.entity] || [];

  try {
    // --- 1. собираем параметры
    const params = await buildParamsFromConfig(configCurrent, formData);

    if (props.entity === 'news') params.author_id = user.user_id;
    if (isUpdate) params.id = props.initialData.id;

    // --- 2. сохраняем сам объект
    const { data } = await axios.post(apiUrl + endpoint + authGet, params, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (data.status === 'false') {
      toast.error(data.error || 'Ошибка при сохранении', { autoClose: 1500 });
      return;
    }

    // --- 3. получаем object_id
    const objectId = data?.object?.id || props.initialData?.id;
    if (!objectId) {
      console.error('Не удалось определить ID объекта');
      return;
    }

    // --- 4. если это entity = objects — отдельно сохраняем изображения
    if (props.entity === 'object' && Array.isArray(formData.srcPhoto)) {
      for (const photo of formData.srcPhoto) {
        // пропускаем пустые
        if (!photo) continue;

        // подготавливаем путь (если нужно — загружаем)
        let imgPath = photo.url?.img || photo.url || photo.path;
        if (!photo.isExisting && photo.file) {
          imgPath = await uploadFile(photo);
        }

        if (!imgPath) continue;

        // подготавливаем данные для запроса
        const imgParams = {
          object_id: objectId,
          img: imgPath,
          alt: data.object.name || 'default',
        };

        // выбираем правильный endpoint
        const imgEndpoint = photo.id && photo.isExisting
          ? 'api-object-img/update'
          : 'api-object-img/set';

        await axios.post(apiUrl + imgEndpoint + authGet, imgParams, {
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    toast.success(isUpdate ? 'Изменения сохранены!' : 'Создано успешно!', {
      autoClose: 1000,
    });

    // Перенаправление на список
    setTimeout(() => {
      router.push(`/admin/${props.entity}`);
    }, 1000);
  } catch (error) {
    console.error('Ошибка при сохранении:', error);
    toast.error('Произошла ошибка при сохранении', { autoClose: 1000 });
  }
}


// ---------------------- DATE HANDLING ----------------------
function handleDateChange(timestamp = false) {
  if (timestamp) {
    const date = new Date(timestamp);
    formattedDate.value = date.toLocaleDateString("ru-RU");
  }
  if (dateRange.value) {
    const date = new Date(dateRange.value);
    formattedDate.value = date.toLocaleDateString("ru-RU");
    formData.date_publication = date.getTime() / 1000;
  }
}
</script>

<template>
  <div class="content-editor">
    <component v-for="field in config" :is="getComponent(field.type)" :key="field.key" v-model="formData[field.key]"
      :label="field.label" v-bind="getFieldProps(field)" />

    <button @click="saveEntity" class="btn btn-primary">Сохранить</button>
  </div>
</template>

<style scoped>
#fileNews {
  display: none;
}

.content-editor {
  color: #666;
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 0 0 40px 0;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

label {
  font-weight: 600;
  font-size: 16px;
  line-height: 18px;
  color: #333;
}
</style>
