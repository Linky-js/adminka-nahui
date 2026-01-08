<script setup>
import gsap from 'gsap'
import { ref, onMounted } from 'vue'
import { useAppStore } from '@/stores/useAppStore'

const store = useAppStore()
const user = store.user
const apiUrl = store.apiUrl
const apiDomain = store.apiDomain

const emit = defineEmits(['goTo'])

const menuItems = ref([
  {
    name: 'Подкасты',
    category: 'podcasts',
    subcategories: [
      { name: 'Категории подкастов', category: 'podcast-category' },
      { name: 'Все подкасты', category: 'podcasts' },
    ],
    open: false,
  },
  { name: 'Новости', category: 'news', subcategories: [], open: false },
  {
    name: 'Видео',
    category: 'video',
    subcategories: [
      { name: 'Категории видео', category: 'video-category' },
      { name: 'Все видео', category: 'video' },
      { name: 'Блогеры', category: 'blogger' },
      { name: 'Банеры', category: 'video-banner' },
    ],
    open: false,
  },
  {
    name: 'Библиотека',
    category: 'book',
    subcategories: [
      { name: 'Категории книг', category: 'book-category' },
      { name: 'Все книги', category: 'book' },
    ],
    open: false,
  },
  { name: 'Материалы', category: 'material', subcategories: [], open: false },
  {
    name: 'Тесты',
    category: 'test',
    subcategories: [
      { name: 'Категории тестов', category: 'test-category' },
      { name: 'Все тесты', category: 'test' },
    ],
    open: false,
  },
  {
    name: 'Обьекты',
    category: 'objects',
    subcategories: [
      { name: 'Категории обьектов', category: 'object-category' },
      { name: 'Все обьекты', category: 'objects' },
    ],
    open: false,
  },
  { name: 'Темы', category: 'theme', subcategories: [], open: false },
  { name: 'Прогресс пользователя', category: 'progress', subcategories: [], open: false },
  { name: 'Уведомления', category: 'notify', subcategories: [], open: false },
])

function getRandomPath() {
  const paths = document.querySelectorAll('.anim-path')
  const randomIndex = Math.floor(Math.random() * paths.length)
  return paths[randomIndex]
}

function getRandomColor() {
  const colors = ['#439563', '#FFC32A', '#2971EB', '#EF8933', '#F092F9', '#E90037']
  const randomColorIndex = Math.floor(Math.random() * colors.length)
  return colors[randomColorIndex]
}

function animateRandomPath() {
  const path = getRandomPath()
  const randomColor = getRandomColor()
  if (!path) return
  gsap.to(path, {
    duration: 0.3,
    rotation: 360,
    fill: randomColor,
    transformOrigin: 'center',
    onComplete: () => {
      gsap.to(path, {
        duration: 0.3,
        delay: 1,
        scaleX: 1,
        scaleY: 1,
        rotation: 0,
        fill: '#fff',
      })
    },
  })
}

function startAnimation() {
  animateRandomPath()
  setTimeout(startAnimation, 2500)
}

function handleClick(event, item) {
  toggleActive(event)
  emit('goTo', item.category)
}

function toggleActive(event) {
  const link = event.target
  const items = document.querySelectorAll('.acc__link')
  items.forEach((i) => i.classList.remove('active'))
  link.classList.add('active')
}

function toggleSubcategories(item) {
  menuItems.value.forEach((i) => (i.open = false))
  item.open = !item.open
}

onMounted(() => {
  startAnimation()
})
</script>
<template>
  <div class="sideBar__content">
    <div class="accHead">
      <div class="logo">
        <svg xmlns="http://www.w3.org/2000/svg" width="149" height="35" viewBox="0 0 149 35" fill="none">
          <path d="M12.983 0.00195312H0V35H12.983V0.00195312Z" fill="white" />
          <path
            d="M17.3066 26.251C17.3066 21.419 21.1806 17.502 25.9594 17.502C30.7381 17.502 34.6121 21.419 34.6121 26.251C34.6121 31.0829 30.7381 35 25.9594 35C21.1806 35 17.3066 31.0829 17.3066 26.251Z"
            fill="white" />
          <path d="M21.6293 0.00195312H34.6005L25.9517 17.502H12.9805L21.6293 0.00195312Z" fill="white" />
          <path class="anim-path"
            d="M46.877 15.2503V0.00195312H50.3279V6.09735H52.4587L56.0369 0.00195312H59.9775L55.3123 7.36871L59.9559 15.2523H55.9292L52.5429 9.30743H50.3279V15.2523H46.877V15.2503Z"
            fill="white" />
          <path class="anim-path"
            d="M63.8324 15.2504V11.9116C64.4866 11.9116 65.0115 11.8819 65.4091 11.8244C65.8203 11.767 66.1611 11.6442 66.4314 11.4581C66.7154 11.2561 66.9778 10.963 67.2187 10.5749L61.5527 0H65.5775L69.0068 7.25784L71.8193 0H75.5032L71.6685 9.04606C71.4276 9.60649 71.1867 10.159 70.9438 10.7036C70.7029 11.2343 70.4405 11.7373 70.1565 12.2106C69.8862 12.6839 69.5807 13.1156 69.2399 13.5037C68.9128 13.878 68.5446 14.185 68.1314 14.4305C67.6202 14.7177 67.017 14.9256 66.3217 15.0543C65.6441 15.185 64.8137 15.2504 63.8324 15.2504Z"
            fill="white" />
          <path class="anim-path"
            d="M75.5957 15.2939V11.9769C76.1363 11.9769 76.5475 11.8759 76.8315 11.6759C77.1292 11.4739 77.3427 11.1868 77.47 10.8145C77.613 10.4402 77.7187 10.0105 77.7892 9.52133C77.846 9.11933 77.8813 8.69554 77.895 8.24997C77.9244 7.79054 77.9381 7.35883 77.9381 6.95683C77.9518 6.54096 77.9596 6.18847 77.9596 5.90132L78.0027 0H88.8862V15.2484H85.4353V3.22989H81.2186L81.1755 6.52512C81.1755 7.64598 81.154 8.69356 81.1109 9.66985C81.0678 10.6323 80.9483 11.4937 80.7486 12.2542C80.5488 13.0146 80.2021 13.6463 79.7047 14.1493C79.2366 14.6087 78.6902 14.9177 78.0654 15.0761C77.4543 15.2207 76.6318 15.2939 75.5957 15.2939Z"
            fill="white" />
          <path class="anim-path"
            d="M91.8906 15.2503V0.00195312H95.3415V5.45177H98.2597C99.0549 5.45177 99.8011 5.53098 100.496 5.6894C101.192 5.83397 101.795 6.08349 102.306 6.4439C102.831 6.78848 103.236 7.26177 103.52 7.86577C103.818 8.45392 103.967 9.20049 103.967 10.1055C103.981 11.1115 103.804 11.9511 103.434 12.6245C103.08 13.2859 102.596 13.8087 101.987 14.1968C101.389 14.585 100.708 14.8582 99.9421 15.0147C99.1744 15.1731 98.3949 15.2523 97.5997 15.2523H91.8906V15.2503ZM95.3415 12.0403H97.7701C98.1677 12.0403 98.53 12.0185 98.8571 11.9749C99.1979 11.9175 99.4955 11.8244 99.7521 11.6957C100.009 11.567 100.199 11.3808 100.328 11.1353C100.471 10.8917 100.541 10.5828 100.541 10.2085C100.541 9.85004 100.485 9.56289 100.371 9.34704C100.257 9.13118 100.087 8.96682 99.8598 8.85196C99.6326 8.72324 99.3702 8.63611 99.0725 8.59254C98.7885 8.54897 98.4693 8.52719 98.1148 8.52719H95.3455V12.0403H95.3415Z"
            fill="white" />
          <path class="anim-path"
            d="M108.313 15.2503V3.23184H103.775V0.00195312H116.341V3.23184H111.762V15.2503H108.313Z" fill="white" />
          <path class="anim-path" d="M46.877 34.8275V19.5791H59.6347V34.8275H56.1838V22.7872H50.3279V34.8275H46.877Z"
            fill="white" />
          <path class="anim-path"
            d="M62.6641 34.8275V19.5791H68.7766C69.9419 19.5791 70.9564 19.7514 71.8221 20.096C72.7015 20.4405 73.383 21.001 73.8668 21.7753C74.3642 22.5515 74.613 23.5991 74.613 24.92C74.613 26.1399 74.3505 27.1597 73.8256 27.9776C73.3008 28.7955 72.5839 29.4054 71.6752 29.8074C70.7664 30.1955 69.7304 30.3896 68.5651 30.3896H66.115V34.8255H62.6641V34.8275ZM66.115 27.2884H68.5651C69.3739 27.2884 70.0124 27.0865 70.4825 26.6845C70.9662 26.2825 71.2071 25.6943 71.2071 24.918C71.2071 24.215 71.0015 23.6902 70.5902 23.3456C70.1926 22.9872 69.5326 22.807 68.6101 22.807H66.1189V27.2884H66.115Z"
            fill="white" />
          <path class="anim-path"
            d="M83.6418 35C82.0946 35 80.753 34.6772 79.6171 34.0316C78.4949 33.3702 77.6292 32.4592 77.0182 31.2968C76.4071 30.1185 76.1016 28.762 76.1016 27.2253C76.1016 25.645 76.413 24.2746 77.0397 23.1122C77.6782 21.9339 78.5654 21.0229 79.7013 20.3774C80.8373 19.7159 82.1788 19.3872 83.7261 19.3872C85.2459 19.3872 86.5659 19.71 87.6882 20.3556C88.8241 21.0012 89.7054 21.9062 90.3302 23.0686C90.9687 24.2172 91.2879 25.5737 91.2879 27.1401C91.2879 28.6768 90.9745 30.0413 90.3498 31.2314C89.725 32.4097 88.8378 33.3345 87.6882 34.0098C86.5522 34.6693 85.2028 35 83.6418 35ZM83.7045 31.7047C84.6701 31.7047 85.4515 31.4829 86.0469 31.0374C86.6443 30.5918 87.0771 30.0254 87.3454 29.3363C87.6157 28.6471 87.7508 27.9441 87.7508 27.2253C87.7508 26.6945 87.6725 26.1618 87.5158 25.6311C87.3728 25.1004 87.1398 24.6113 86.8127 24.1657C86.4993 23.7201 86.088 23.3617 85.5769 23.0884C85.0657 22.8151 84.4331 22.6785 83.681 22.6785C82.7292 22.6785 81.9556 22.9003 81.3602 23.3458C80.7628 23.7776 80.3241 24.336 80.0401 25.0252C79.7699 25.7143 79.6347 26.4391 79.6347 27.1995C79.6347 27.96 79.7777 28.6848 80.0617 29.3739C80.3457 30.0631 80.7863 30.6235 81.3817 31.0532C81.9947 31.4889 82.7684 31.7047 83.7045 31.7047Z"
            fill="white" />
          <path class="anim-path"
            d="M100.071 35C98.5102 35 97.1745 34.6851 96.066 34.0514C94.9594 33.4197 94.1133 32.5226 93.5316 31.3602C92.9637 30.1977 92.6797 28.8333 92.6797 27.2688C92.6797 25.6747 92.9774 24.2905 93.5747 23.1122C94.1701 21.9339 95.0162 21.0229 96.1091 20.3774C97.2176 19.7159 98.5239 19.3872 100.028 19.3872C101.193 19.3872 102.243 19.5951 103.181 20.011C104.119 20.4269 104.877 21.0447 105.461 21.8626C106.056 22.6666 106.419 23.6865 106.546 24.9202H103.244C103.074 24.2172 102.725 23.6706 102.2 23.2825C101.689 22.8805 100.994 22.6785 100.112 22.6785C99.1604 22.6785 98.4005 22.9003 97.8325 23.3458C97.2646 23.7776 96.8533 24.3301 96.5967 25.0034C96.3558 25.6786 96.2344 26.3817 96.2344 27.1144C96.2344 27.8748 96.3617 28.6075 96.6183 29.3105C96.8885 30.0135 97.3077 30.5878 97.8756 31.0334C98.4573 31.479 99.2251 31.7008 100.175 31.7008C100.743 31.7008 101.24 31.6156 101.665 31.4414C102.106 31.2691 102.468 31.0176 102.752 30.6869C103.036 30.3561 103.234 29.9621 103.348 29.5026H106.734C106.62 30.6948 106.244 31.6988 105.606 32.5186C104.981 33.3365 104.178 33.9544 103.199 34.3702C102.237 34.792 101.193 35 100.071 35Z"
            fill="white" />
          <path class="anim-path"
            d="M108.9 34.8275V19.5791H115.951C116.617 19.5791 117.228 19.6504 117.782 19.795C118.35 19.9237 118.84 20.1474 119.251 20.4623C119.678 20.7633 120.011 21.1733 120.252 21.6901C120.493 22.1931 120.614 22.8308 120.614 23.6071C120.614 24.1952 120.479 24.7556 120.209 25.2864C119.939 25.8171 119.555 26.227 119.059 26.5141C119.727 26.7736 120.26 27.2033 120.657 27.8073C121.071 28.3954 121.274 29.1638 121.274 30.1124C121.274 31.0451 121.104 31.8214 120.763 32.4392C120.436 33.0432 119.982 33.5225 119.4 33.8829C118.832 34.2275 118.178 34.471 117.441 34.6156C116.703 34.7602 115.93 34.8314 115.121 34.8314H108.9V34.8275ZM112.351 31.6174H115.461C115.816 31.6174 116.135 31.5877 116.419 31.5303C116.717 31.459 116.966 31.3659 117.163 31.251C117.377 31.1223 117.532 30.956 117.631 30.756C117.745 30.5401 117.802 30.2965 117.802 30.0233C117.802 29.7361 117.753 29.4985 117.653 29.3123C117.567 29.1262 117.434 28.9757 117.25 28.8608C117.065 28.7321 116.844 28.645 116.59 28.6034C116.335 28.5459 116.043 28.5162 115.716 28.5162H112.351V31.6174ZM112.351 25.6527H115.099C115.44 25.6527 115.738 25.6171 115.994 25.5458C116.264 25.4745 116.484 25.3735 116.654 25.2448C116.825 25.116 116.954 24.9576 117.038 24.7715C117.138 24.5853 117.187 24.3695 117.187 24.1259C117.187 23.7952 117.109 23.5377 116.954 23.3496C116.811 23.1476 116.605 23.013 116.337 22.9397C116.067 22.8526 115.74 22.811 115.356 22.811H112.353V25.6527H112.351Z"
            fill="white" />
          <path class="anim-path"
            d="M123.482 34.8275V19.5791H134.601V22.809H126.933V25.6943H133.387V28.7955H126.933V31.6174H134.601V34.8255H123.482V34.8275Z"
            fill="white" />
          <path class="anim-path" d="M140.968 34.8275V22.809H136.432V19.5791H148.999V22.809H144.42V34.8275H140.968Z"
            fill="white" />
        </svg>
      </div>
      <div class="head-text">Административная панель</div>
    </div>
    <div class="accBody">
      <div v-for="item in menuItems" :key="item.category">
        <a @click="
          [
            toggleSubcategories(item),
            handleClick($event, {
              category: item.category,
            }),
          ]
          " class="acc__link" :class="{ active: item.open }">
          {{ item.name }}
        </a>
        <!-- Подкатегории -->
        <div v-if="item.open" class="subcategories">
          <a v-for="(sub, index) in item.subcategories" :key="index" @click="
            handleClick($event, {
              category: sub.category,
            })
            " class="acc__link sub-link">
            {{ sub.name }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sideBar__content {
  display: flex;
  flex-direction: column;
  gap: 64px;
  padding: 42px 51px;
  align-items: center;
}

.accHead {
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
}

.head-text {
  color: #fff;
  font-family: Onest;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}

.accBody {
  display: flex;
  flex-direction: column;
  gap: 23px;
  width: 100%;
}

.acc__link {
  position: relative;
  color: #fff;
  font-family: Onest;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  padding-bottom: 10px;
  cursor: pointer;
}

.acc__link.active::before {
  content: "";
  position: absolute;
  bottom: 5px;
  left: 0;
  width: 28px;
  height: 2px;
  background: #fff;
}

.subcategories {
  display: flex;
  flex-direction: column;
  padding-left: 20px;
  gap: 10px;
  margin-top: 10px;
}

.sub-link {
  font-weight: 400;
  color: #ddd;
}
</style>