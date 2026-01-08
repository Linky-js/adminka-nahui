export const entityConfigs = {
  news: [
    { type: 'input', key: 'title', label: 'Заголовок', sourceKey: 'title', targetKey: 'title' },
    { type: 'input', key: 'slug', label: 'Слаг', sourceKey: 'slug', targetKey: 'slug' },

    { type: 'textarea', key: 'shortText', label: 'Краткое описание', sourceKey: 'short_text', targetKey: 'short_text' },
    { type: 'editor', key: 'text', label: 'Контент', sourceKey: 'text', targetKey: 'text' },
    { type: 'date', key: 'date_publication', label: 'Дата публикации', sourceKey: 'date_publication', targetKey: 'date_publication' },
    { type: 'images', key: 'srcPhoto', label: 'Главное фото', sourceKey: 'title_photo', targetKey: 'title_photo', props: { multiple: false } },
    { type: 'select', key: 'theme', label: 'Тема', sourceKey: 'theme_id', targetKey: 'theme_id', props: { options: [] } },
  ],
  news1category: [
    { type: 'input', key: 'name', label: 'Заголовок', sourceKey: 'name', targetKey: 'name' },
    { type: 'textarea', key: 'description', label: 'Описание', sourceKey: 'description', targetKey: 'description' },
    { type: 'input', key: 'slag', label: 'Слаг', sourceKey: 'slag', targetKey: 'slag' },
  ],
  video: [
    { type: 'select', key: 'theme', label: 'Тема', sourceKey: 'theme_id', targetKey: 'theme_id', props: { options: [] } },
    { type: 'select', key: 'categorieId', label: 'Категория', sourceKey: 'category_id', targetKey: 'category_id', props: { options: [] } },
    // { type: 'select', key: 'blogger_id', label: 'Blogger', sourceKey: 'blogger_id', targetKey: 'blogger_id', props: { options: [] } },

    { type: 'input', key: 'title', label: 'Название видео', sourceKey: 'title', targetKey: 'title' },
    { type: 'textarea', key: 'shortText', label: 'Описание', sourceKey: 'description', targetKey: 'description' },
    { type: 'input', key: 'link', label: 'Ссылка на видео', sourceKey: 'link', targetKey: 'link' },
    
    { type: 'images', key: 'srcPhoto', label: 'Постер', sourceKey: 'poster', targetKey: 'poster', props: { multiple: false } },

    { type: 'input', key: 'sort', label: 'Сортировка', sourceKey: 'sort', targetKey: 'sort' },
    { type: 'input', key: 'blogger_id', label: 'Blogger ID', sourceKey: 'blogger_id', targetKey: 'blogger_id' },
    // { type: 'date', key: 'date_publication', label: 'Дата публикации', sourceKey: 'date_publication', targetKey: 'date_publication' },
  ],

  video1category: [
    { type: 'input', key: 'name', label: 'Заголовок', sourceKey: 'name', targetKey: 'name' },
    { type: 'textarea', key: 'description', label: 'Описание', sourceKey: 'description', targetKey: 'description' },
    { type: 'input', key: 'slag', label: 'Слаг', sourceKey: 'slag', targetKey: 'slag' },
  ],
  video1banner: [
    { type: 'select', key: 'theme', label: 'Тема', sourceKey: 'theme_id', targetKey: 'theme_id', props: { options: [] } },
    { type: 'select', key: 'categorieId', label: 'Категория', sourceKey: 'category_id', targetKey: 'category_id', props: { options: [] } },
    { type: 'input', key: 'title', label: 'Заголовок', targetKey: 'title' },
    { type: 'images', key: 'srcPhoto', label: 'Картинка', sourceKey: 'filename', targetKey: 'filename', props: { multiple: false } },
    { type: 'images', key: 'posterMobile', label: 'Постер мобильная', sourceKey: 'poster_mobile', targetKey: 'poster_mobile', props: { multiple: false } },
    { type: 'input', key: 'btnText', label: 'Текст кнопки', sourceKey: 'btn_text', targetKey: 'btn_text' },
    { type: 'input', key: 'btnLink', label: 'Ссылка кнопки', sourceKey: 'btn_link', targetKey: 'btn_link' },
    { type: 'input', key: 'time', label: 'Длительность видео (сек.)', targetKey: 'time' },
  ],

  podcast: [
    { type: 'select', key: 'theme', label: 'Тема', sourceKey: 'theme_id', targetKey: 'theme_id', props: { options: [] } },
    { type: 'select', key: 'categorieId', label: 'Категория', sourceKey: 'category_id', targetKey: 'category_id', props: { options: [] } },
    { type: 'input', key: 'title', label: 'Название подкаста', sourceKey: 'title', targetKey: 'title' },
    { type: 'textarea', key: 'shortText', label: 'Описание', sourceKey: 'description', targetKey: 'description' },
    // { type: 'input', key: 'audio', label: 'Ссылка на аудио', sourceKey: 'link', targetKey: 'link' },
    { type: 'file', key: 'link', label: 'Файл', sourceKey: 'link', targetKey: 'file' },
    { type: 'images', key: 'srcPhoto', label: 'Картинка подкаста', sourceKey: 'pic', targetKey: 'pic', props: { multiple: false } },
    { type: 'input', key: 'sort', label: 'Сортировка', sourceKey: 'sort', targetKey: 'sort' },
    { type: 'date', key: 'date_publication', label: 'Дата публикации', sourceKey: 'date_publication', targetKey: 'date_publication' },
  ],

  podcast1category: [
    { type: 'input', key: 'name', label: 'Заголовок', sourceKey: 'name', targetKey: 'name' },
    { type: 'textarea', key: 'description', label: 'Описание', sourceKey: 'description', targetKey: 'description' },
    { type: 'input', key: 'slag', label: 'Слаг', sourceKey: 'slag', targetKey: 'slag' },
  ],

  blogger: [
    { type: 'input', key: 'title', label: 'Имя/название блогера', sourceKey: 'title', targetKey: 'title' },
    { type: 'textarea', key: 'shortText', label: 'Описание', sourceKey: 'description', targetKey: 'description' },
    { type: 'input', key: 'link', label: 'Ссылка', sourceKey: 'link', targetKey: 'link' },
    { type: 'images', key: 'srcPhoto', label: 'Постер/аватар', sourceKey: 'poster', targetKey: 'poster', props: { multiple: false } },
  ],

  theme: [
    { type: 'input', key: 'title', label: 'Название темы', sourceKey: 'name', targetKey: 'name' },
    { type: 'textarea', key: 'shortText', label: 'Описание темы', sourceKey: 'description', targetKey: 'description' },
    { type: 'images', key: 'podcastBanner', label: 'Podcast banner', sourceKey: 'podcast_banner', targetKey: 'podcast_banner', props: { multiple: false } },
    { type: 'images', key: 'banner', label: 'Banner', sourceKey: 'banner', targetKey: 'banner', props: { multiple: false } },
    { type: 'images', key: 'bannerFull', label: 'Banner full', sourceKey: 'banner_full', targetKey: 'banner_full', props: { multiple: false } },
    { type: 'images', key: 'headerImg', label: 'Header img', sourceKey: 'img', targetKey: 'img', props: { multiple: false } },
    { type: 'input', key: 'quote', label: 'Цитата', sourceKey: 'quote', targetKey: 'quote' },
    { type: 'date', key: 'date_publication', label: 'Дата публикации', sourceKey: 'date_publication', targetKey: 'date_publication' },
  ],

  book: [
    { type: 'select', key: 'theme', label: 'Тема', sourceKey: 'theme_id', targetKey: 'theme_id', props: { options: [] } },
    { type: 'select', key: 'categorieId', label: 'Категория', sourceKey: 'category_id', targetKey: 'category_id', props: { options: [] } },
    { type: 'input', key: 'title', label: 'Название книги', sourceKey: 'title', targetKey: 'title' },
    { type: 'input', key: 'sizePdf', label: 'Размер (PDF)', sourceKey: 'size', targetKey: 'size' },
    { type: 'input', key: 'bookSrc', label: 'Ссылка на файл', sourceKey: 'link', targetKey: 'link' },
    { type: 'images', key: 'srcPhoto', label: 'Обложка', sourceKey: 'poster', targetKey: 'poster', props: { multiple: false } },
    { type: 'date', key: 'date_publication', label: 'Дата публикации', sourceKey: 'date_publication', targetKey: 'date_publication' },
  ],

  book1category: [
    { type: 'input', key: 'name', label: 'Заголовок', sourceKey: 'name', targetKey: 'name' },
    { type: 'textarea', key: 'description', label: 'Описание', sourceKey: 'description', targetKey: 'description' },
    { type: 'input', key: 'slag', label: 'Слаг', sourceKey: 'slag', targetKey: 'slag' },
  ],

  material: [
    { type: 'select', key: 'theme', label: 'Тема', sourceKey: 'theme_id', targetKey: 'theme_id', props: { options: [] } },
    { type: 'select', key: 'categorieId', label: 'Категория', sourceKey: 'category_id', targetKey: 'category_id', props: { options: [] } },
    { type: 'input', key: 'title', label: 'Название материала', sourceKey: 'title', targetKey: 'title' },
    { type: 'input', key: 'sizePdf', label: 'Размер (PDF)', sourceKey: 'size', targetKey: 'size' },
    { type: 'input', key: 'bookSrc', label: 'Ссылка на файл', sourceKey: 'link', targetKey: 'link' },
    { type: 'images', key: 'srcPhoto', label: 'Обложка', sourceKey: 'poster', targetKey: 'poster', props: { multiple: false } },
    { type: 'date', key: 'date_publication', label: 'Дата публикации', sourceKey: 'date_publication', targetKey: 'date_publication' },
  ],

  notify: [
    { type: 'input', key: 'title', label: 'Заголовок уведомления', sourceKey: 'title', targetKey: 'title' },
    { type: 'textarea', key: 'shortText', label: 'Текст уведомления', sourceKey: 'text', targetKey: 'text' },
    { type: 'input', key: 'link', label: 'Ссылка', sourceKey: 'link', targetKey: 'link' },
    { type: 'date', key: 'date_publication', label: 'Дата публикации', sourceKey: 'date_publication', targetKey: 'date_publication' },
  ],

  object: [
    { type: 'input', key: 'title', label: 'Название объекта', sourceKey: 'name', targetKey: 'name' },
    { type: 'textarea', key: 'shortText', label: 'Описание', sourceKey: 'description', targetKey: 'description' },
    { type: 'input', key: 'link', label: 'Ссылка', sourceKey: 'link', targetKey: 'link' },
    { type: 'input', key: 'tag', label: 'Тег', sourceKey: 'tag', targetKey: 'tag' },
    { type: 'input', key: 'slag', label: 'Слаг', sourceKey: 'slag', targetKey: 'slag' },
    { type: 'input', key: 'lat', label: 'Широта', sourceKey: 'lat', targetKey: 'lat' },
    { type: 'input', key: 'lon', label: 'Долгота', sourceKey: 'lon', targetKey: 'lon' },
    { type: 'images', key: 'srcPhoto', label: 'Картинки', sourceKey: 'img', targetKey: 'img', props: { multiple: true } },
    { type: 'select', key: 'regionId', label: 'Регион', sourceKey: 'region_id', targetKey: 'region_id', props: { options: [] } },
    { type: 'select', key: 'categorieId', label: 'Категория', sourceKey: 'category_id', targetKey: 'category_id', props: { options: [] } },
    { type: 'date', key: 'date_publication', label: 'Дата публикации', sourceKey: 'date_publication', targetKey: 'date_publication' },
  ],
  object1category: [
    { type: 'input', key: 'name', label: 'Заголовок', sourceKey: 'name', targetKey: 'name' },
    { type: 'textarea', key: 'description', label: 'Описание', sourceKey: 'description', targetKey: 'description' },
    { type: 'input', key: 'slag', label: 'Слаг', sourceKey: 'slag', targetKey: 'slag' },
  ],
};

