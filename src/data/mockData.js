import { MEDIA_TYPES } from '../utils/storage'

export const mockFragments = [
  {
    id: 'mock1',
    type: MEDIA_TYPES.TEXT,
    title: '深夜地铁里的一段独白',
    content: '霓虹灯下的城市，每个人都是孤独的岛屿。我们在地铁里擦肩而过，却不知道彼此的故事。',
    tags: ['歌词', '城市', '夜晚'],
    createdAt: Date.now() - 86400000 * 2,
    isPublished: true
  },
  {
    id: 'mock2',
    type: MEDIA_TYPES.IMAGE,
    title: '雨后老街的街角咖啡店',
    imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600',
    tags: ['街拍', '咖啡店', '雨后'],
    createdAt: Date.now() - 86400000 * 1,
    isPublished: true
  },
  {
    id: 'mock3',
    type: MEDIA_TYPES.COLOR_PALETTE,
    title: '秋日黄昏的温暖色调',
    colors: ['#D4A574', '#C4956A', '#8B6914', '#F5E6D3', '#FFF8F0'],
    tags: ['配色', '秋天', '温暖'],
    createdAt: Date.now() - 86400000 * 3,
    isPublished: true
  },
  {
    id: 'mock4',
    type: MEDIA_TYPES.AUDIO_COVER,
    title: '午夜电台 Vol.07',
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600',
    content: '深夜的爵士，城市的呼吸，和你一起度过的第七个夜晚。',
    tags: ['音乐', '电台', '爵士'],
    createdAt: Date.now() - 86400000 * 5,
    isPublished: true
  },
  {
    id: 'mock5',
    type: MEDIA_TYPES.TEXT,
    title: '手写草稿片段',
    content: '如果时间可以倒流，我想回到那个夏天的午后。阳光透过树叶洒在操场上，蝉鸣声中，我们谈论着遥远的梦想。',
    tags: ['手写', '回忆', '夏天'],
    createdAt: Date.now() - 86400000 * 4,
    isPublished: true
  },
  {
    id: 'mock6',
    type: MEDIA_TYPES.IMAGE,
    title: '老巷子里的涂鸦墙',
    imageUrl: 'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=600',
    tags: ['街拍', '涂鸦', '艺术'],
    createdAt: Date.now() - 86400000 * 6,
    isPublished: true
  },
  {
    id: 'mock7',
    type: MEDIA_TYPES.COLOR_PALETTE,
    title: '深海蓝调',
    colors: ['#1a3a5c', '#2c5282', '#4299e1', '#90cdf4', '#ebf8ff'],
    tags: ['配色', '海洋', '蓝色'],
    createdAt: Date.now() - 86400000 * 7,
    isPublished: true
  },
  {
    id: 'mock8',
    type: MEDIA_TYPES.IMAGE,
    title: '清晨的露水与花瓣',
    imageUrl: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600',
    tags: ['摄影', '自然', '清晨'],
    createdAt: Date.now() - 86400000 * 8,
    isPublished: true
  },
  {
    id: 'mock9',
    type: MEDIA_TYPES.TEXT,
    title: '即兴歌词片段',
    content: '我在人海中漂流，寻找属于我的那盏灯。每一个陌生人的背影，都像是你的轮廓。',
    tags: ['歌词', '抒情', '流行'],
    createdAt: Date.now() - 86400000 * 9,
    isPublished: true
  },
  {
    id: 'mock10',
    type: MEDIA_TYPES.AUDIO_COVER,
    title: 'Lo-Fi 卧室日记',
    imageUrl: 'https://images.unsplash.com/photo-1458560871784-56d23406c091?w=600',
    content: '一个人的房间，一盏台灯，和无尽的思绪。',
    tags: ['音乐', 'Lo-Fi', '独处'],
    createdAt: Date.now() - 86400000 * 10,
    isPublished: true
  },
  {
    id: 'mock11',
    type: MEDIA_TYPES.COLOR_PALETTE,
    title: '樱花粉配色',
    colors: ['#FFB7C5', '#FFC0CB', '#FFD1DC', '#FFE4E9', '#FFF0F3'],
    tags: ['配色', '粉色', '春天'],
    createdAt: Date.now() - 86400000 * 11,
    isPublished: true
  },
  {
    id: 'mock12',
    type: MEDIA_TYPES.IMAGE,
    title: '城市夜景俯瞰',
    imageUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=600',
    tags: ['街拍', '夜景', '城市'],
    createdAt: Date.now() - 86400000 * 12,
    isPublished: true
  }
]
