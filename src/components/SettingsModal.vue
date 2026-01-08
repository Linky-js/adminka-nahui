<template>
    <div class="settings-overlay" @click.self="close">
        <div class="settings-modal">
            <h3>Настройки API</h3>
            <div class="field">
                <label>API URL</label>
                <input v-model="localApiUrl" placeholder="https://example.com/" />
            </div>
            <div class="field">
                <label>API DOMAIN</label>
                <input v-model="localApiDomain" placeholder="example.com" />
            </div>
            <div class="field">
                <label>Pages / Entities</label>
                <div class="pages">
                    <div class="page" v-for="(page, pIndex) in pages" :key="pIndex">
                        <h4>Наименование сущности</h4>
                        <div class="page-header">

                            <input v-model="page.label" placeholder="display label (Например: Все видео)" />
                            <input v-model="page.key" placeholder="page key (например video)" />
                            <button class="btn small" @click="removePage(pIndex)">Удалить страницу</button>
                        </div>
                        <line></line>
                        <h4>Поля</h4>
                        <div class="fields">
                            <div class="field-row" v-for="(f, fIndex) in page.fields" :key="fIndex">

                                <div class="field-stroke">
                                    <input v-model="f.label" placeholder="label (Название)" />
                                    <select v-model="f.type">
                                        <option value="input">input</option>
                                        <option value="textarea">textarea</option>
                                        <option value="editor">editor</option>
                                        <option value="select">select</option>
                                        <option value="images">images</option>
                                        <option value="file">file</option>
                                        <option value="date">date</option>
                                        <option value="coords">coords</option>
                                    </select>
                                </div>
                                <input v-model="f.key" placeholder="field key (slug, title)" />
                                <input v-if="f.type === 'select'" v-model="f.optionsText"
                                    placeholder='options (JSON array or comma list)' />
                                <button class="btn-delete" @click="removeField(pIndex, fIndex)">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                        class="bi bi-trash3" viewBox="0 0 16 16">
                                        <path
                                            d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                                    </svg>
                                </button>
                            </div>
                            <button class="btn small" @click="addField(pIndex)">Добавить поле</button>
                        </div>
                    </div>
                    <button class="btn" @click="addPage">Добавить страницу</button>
                </div>
                <div class="hint">Страницы будут сохранены как ключ => массив полей; используйте page key в AdminPage.
                </div>
            </div>
            <div class="actions">
                <button class="btn secondary" @click="close">Отмена</button>
                <button class="btn primary" @click="save">Сохранить</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAppStore } from '@/stores/useAppStore'

const store = useAppStore()

const emit = defineEmits(['close'])

const localApiUrl = ref(store.apiUrl)
const localApiDomain = ref(store.apiDomain)
// local editable model: pages[] where each page = { key, label, fields: [{key,label,type,sourceKey,optionsText}] }
const pages = ref([])
const error = ref('')

// initialize local pages from store.entities
function loadPagesFromStore() {
    const ents = store.entities || {}
    pages.value = []
    for (const k in ents) {
        const entry = ents[k]
        let arr = []
        let label = k
        if (Array.isArray(entry)) {
            arr = entry
        } else if (entry && typeof entry === 'object' && entry.fields) {
            arr = entry.fields
            if (entry.label) label = entry.label
        }

        const fields = (arr || []).map(f => ({
            key: f.key || f.sourceKey || f.targetKey || '',
            label: f.label || '',
            type: f.type || 'input',
            sourceKey: f.sourceKey || f.key || '',
            optionsText: (f.props && f.props.options) ? JSON.stringify(f.props.options, null, 2) : ''
        }))
        pages.value.push({ key: k, label, fields })
    }
}

loadPagesFromStore()

function close() {
    emit('close')
}

function save() {
    try {
        const mapped = {}
        pages.value.forEach(p => {
            const key = (p.key || '').toString().trim()
            if (!key) return
            mapped[key] = {
                label: p.label || key,
                fields: (p.fields || []).map(f => {
                    const obj = {
                        type: f.type || 'input',
                        key: f.key || f.sourceKey || '',
                        label: f.label || '',
                        sourceKey: f.sourceKey || f.key || '',
                        targetKey: f.sourceKey || f.key || ''
                    }
                    if (f.type === 'select' && f.optionsText) {
                        try {
                            obj.props = { options: JSON.parse(f.optionsText) }
                        } catch (e) {
                            // try comma list
                            const parts = f.optionsText.split(',').map(s => s.trim()).filter(Boolean)
                            obj.props = { options: parts.map(p => ({ value: p, label: p })) }
                        }
                    }
                    return obj
                })
            }
        })

        store.setApiUrl(localApiUrl.value)
        store.setApiDomain(localApiDomain.value)
        store.setEntities(mapped)
        emit('close')
    } catch (e) {
        error.value = 'Ошибка при сохранении сущностей'
        console.error(e)
    }
}

function addPage() {
    pages.value.push({ key: '', label: '', fields: [] })
}

function removePage(index) {
    pages.value.splice(index, 1)
}

function addField(pageIndex) {
    pages.value[pageIndex].fields.push({ key: '', label: '', type: 'input', sourceKey: '', optionsText: '' })
}

function removeField(pageIndex, fieldIndex) {
    pages.value[pageIndex].fields.splice(fieldIndex, 1)
}
</script>

<style scoped>
.settings-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.35);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1200;
}

.settings-modal {
    width: 420px;
    background: #fff;
    border-radius: 14px;
    padding: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
}

.settings-modal h3 {
    margin: 0 0 12px 0;
    font-weight: 600;
}

.field {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 12px
}

.field label {
    font-size: 13px;
    color: #666
}

.field input {
    padding: 10px;
    border-radius: 10px;
    border: 1px solid #e6e6e6
}

.actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end
}

.btn {
    padding: 8px 14px;
    border-radius: 10px;
    cursor: pointer;
    border: none
}

.btn.primary {
    background: #0070f3;
    color: #fff
}

.btn.secondary {
    background: #f1f1f1
}

.pages {
    max-height: calc(90vh - 280px);
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

h3,
.hint,
h4 {
    color: #333;
}

.page,
.fields,
.page-header {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.field-stroke {
    display: flex;
    gap: 10px;
}

select {
    flex-shrink: 0;
}

.field-row {
    display: flex;
    gap: 10px;
    flex-direction: column;
}

.page {
    padding: 5px;
    border-radius: 5px;
    border: 2px solid #f19090;
}

line {
    height: 1px;
    background: #e6e6e6;
    margin: 10px 0;
}

.fields {
    max-height: 300px;
    overflow-y: auto;
}

.btn-delete {
    padding: 5px 6px;
    background-color: #f19090;
    width: max-content;
    border: none;
    outline: none;
    border-radius: 5px;
    flex-shrink: 0;
    display: flex;
    cursor: pointer;
}

.btn-delete:hover svg {
    fill: #fff;
}
</style>
