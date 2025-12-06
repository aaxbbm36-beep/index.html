
import { Song, Playlist, RadioStation } from './types';

const LYRICS_PERFECT = `
00:00
I found a love... for me
00:05
Darling, just dive right in
00:10
And follow my lead
00:15
Well, I found a girl, beautiful and sweet
00:20
Oh, I never knew you were the someone waiting for me
00:25
'Cause we were just kids when we fell in love
00:30
Not knowing what it was
00:35
I will not give you up this time
00:40
But darling, just kiss me slow
00:45
Your heart is all I own
00:50
And in your eyes, you're holding mine
`;

const LYRICS_LOFI = `
(Instrumental - Relaxing Beats)
...
(Rain sounds in background)
...
(Soft piano melody)
...
Just close your eyes and drift away...
`;

const LYRICS_LAN_CUOI = `
00:00
Nhìn quanh lần cuối
00:04
Rừng thay lá ngậm ngùi
00:08
Rừng không báo tin vui gì
00:12
Chỉ cố che màn mưa
00:16
Lặng im như lá
00:20
Em không nói một lời
00:24
Không khóc không cười chi
00:28
Cuốn theo chiều gió đưa
00:32
Dễ như nuốt thật nhanh ngụm cà phê cuối
00:36
Dễ như cách em xua bàn tay để che tiếc nuối
00:40
Dễ như cách em quay lại, quay lại...
00:44
Chỉ để buông lời tha thứ nhân từ
00:48
Vậy là lần cuối đi bên nhau
00:52
Cay đắng nhưng không đau
00:56
Nếu ai cũng mang tội thì người mong đợi gì nơi tôi
01:00
Tiễn em tới đây thôi
01:04
Phố mưa cũng đang tạnh rồi
01:08
Y như một giấc mơ trôi...
`;

const LYRICS_MO = `
00:00
Mơ... lạc vào giấc mơ
00:05
Em đi tìm anh
00:10
Trong những giấc mơ
00:15
Gửi gió mang về
00:20
Hương tóc thề
00:25
Mơ... lạc vào giấc mơ
`;

const LYRICS_TRAI_DAT = `
00:00
Em cứ đi tiếp thôi
00:05
Trái đất vẫn cứ ôm mặt trời
00:10
Và tôi vẫn cứ ôm lấy em
00:15
Trong những giấc mơ
00:20
Lần cuối ta đi bên nhau
00:25
Em cứ đi tiếp thôi
`;

// Reliable Image Seeds for Picsum (Guaranteed to load)
const IMAGES = {
    CYBER_CITY: 'cyberpunk-city',
    NEON_SIGN: 'neon-lights',
    GUITAR_DARK: 'guitar-dark',
    VINYL: 'vinyl-record',
    HEADPHONES: 'headphones-music',
    PIANO: 'piano-keys',
    RAIN_WINDOW: 'rain-window',
    CONCERT: 'concert-stage',
    ABSTRACT_RED: 'abstract-red',
    ABSTRACT_ORANGE: 'abstract-orange',
    MICROPHONE: 'microphone-singer',
    SINGER: 'singer-perform',
    CASSETTE: 'cassette-tape',
    NATURE: 'nature-forest',
    SLEEP: 'sleep-bed',
    YOGA: 'yoga-pose'
};

// Generates a consistent image URL based on a seed string
const getImg = (seed: string) => `https://picsum.photos/seed/${seed}/400/400`;

export const MOCK_SONGS: Song[] = [
  // VIETNAMESE SONGS (Priority)
  {
    id: 'v1',
    title: 'Lần Cuối',
    artist: 'Ngọt',
    coverUrl: getImg('ngot-band-vibe'), 
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3',
    duration: '3:41',
    genre: 'Indie Pop',
    views: '25M',
    lyrics: LYRICS_LAN_CUOI
  },
  {
    id: 'v2',
    title: 'Mơ',
    artist: 'Vũ Cát Tường',
    coverUrl: getImg('vu-cat-tuong-mo'),
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: '3:50',
    genre: 'Pop',
    views: '40M',
    lyrics: LYRICS_MO
  },
  {
    id: 'v3',
    title: 'Trái Đất Ôm Mặt Trời',
    artist: 'Kai Đinh',
    coverUrl: getImg('kai-dinh-sun'),
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: '4:10',
    genre: 'Pop Ballad',
    views: '15M',
    lyrics: LYRICS_TRAI_DAT
  },
  // INTERNATIONAL & OTHERS
  {
    id: 's1',
    title: 'Weightless',
    artist: 'Marconi Union',
    coverUrl: getImg('ambient-weightless'),
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: '8:00',
    genre: 'Ambient',
    views: '120M',
    lyrics: LYRICS_LOFI
  },
  {
    id: 's2',
    title: 'Perfect',
    artist: 'Ed Sheeran',
    coverUrl: getImg('ed-sheeran-perfect'),
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: '4:23',
    genre: 'Pop',
    views: '3B',
    lyrics: LYRICS_PERFECT
  },
  {
    id: 's3',
    title: 'River Flows In You',
    artist: 'Yiruma',
    coverUrl: getImg('piano-river'),
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: '3:08',
    genre: 'Piano',
    views: '500M'
  },
  {
    id: 's4',
    title: 'ocean eyes',
    artist: 'Billie Eilish',
    coverUrl: getImg('ocean-blue'),
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    duration: '3:20',
    genre: 'Indie Pop',
    views: '900M'
  },
  {
    id: 's5',
    title: 'Night Trouble',
    artist: 'Petit Biscuit',
    coverUrl: getImg('night-city'),
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    duration: '4:15',
    genre: 'Chill',
    views: '80M'
  },
  {
    id: 's6',
    title: 'Clair de Lune',
    artist: 'Claude Debussy',
    coverUrl: getImg('moon-light'),
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    duration: '5:00',
    genre: 'Classical',
    views: '200M'
  },
  {
    id: 's7',
    title: 'Sunset Lover',
    artist: 'Petit Biscuit',
    coverUrl: getImg('sunset-beach'),
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    duration: '3:57',
    genre: 'Chill',
    views: '600M'
  },
  {
    id: 's8',
    title: 'Sparks',
    artist: 'Coldplay',
    coverUrl: getImg('sparks-fire'),
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    duration: '3:47',
    genre: 'Alternative',
    views: '300M'
  },
  {
    id: 's9',
    title: 'Banana Pancakes',
    artist: 'Jack Johnson',
    coverUrl: getImg('pancakes-morning'),
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
    duration: '3:12',
    genre: 'Acoustic',
    views: '250M'
  },
  {
    id: 's10',
    title: 'Mystery of Love',
    artist: 'Sufjan Stevens',
    coverUrl: getImg('mystery-love'),
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
    duration: '4:08',
    genre: 'Indie Folk',
    views: '150M'
  },
  {
    id: 's11',
    title: 'Holocene',
    artist: 'Bon Iver',
    coverUrl: getImg('winter-holocene'),
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3',
    duration: '5:36',
    genre: 'Indie Folk',
    views: '100M'
  },
  {
    id: 's12',
    title: 'Bloom',
    artist: 'The Paper Kites',
    coverUrl: getImg('flower-bloom'),
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3',
    duration: '3:30',
    genre: 'Acoustic',
    views: '180M'
  },
  {
    id: 's13',
    title: 'Space Song',
    artist: 'Beach House',
    coverUrl: getImg('space-stars'),
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3',
    duration: '5:20',
    genre: 'Dream Pop',
    views: '400M'
  },
  {
    id: 's14',
    title: 'Experience',
    artist: 'Ludovico Einaudi',
    coverUrl: getImg('experience-life'),
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3',
    duration: '5:15',
    genre: 'Classical',
    views: '350M'
  },
  {
    id: 's15',
    title: 'Midnight City',
    artist: 'M83',
    coverUrl: getImg('midnight-drive'),
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3',
    duration: '4:03',
    genre: 'Electronic',
    views: '600M'
  },
  // PODCASTS
  {
    id: 'pc1',
    title: 'Mindfulness Meditation',
    artist: 'Headspace',
    coverUrl: getImg('meditation-mind'),
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3',
    duration: '20:00',
    genre: 'Podcast',
    views: '5M'
  },
  {
    id: 'pc2',
    title: 'Sleep Stories',
    artist: 'Calm',
    coverUrl: getImg('sleep-story'),
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: '45:00',
    genre: 'Podcast',
    views: '8M'
  },
  {
    id: 'pc3',
    title: 'Morning Yoga Flow',
    artist: 'Yoga with Adriene',
    coverUrl: getImg('yoga-morning'),
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: '30:00',
    genre: 'Podcast',
    views: '3M'
  }
];

export const MOCK_ALBUMS: Playlist[] = [
  {
    id: 'a1',
    title: 'Neon Nights',
    description: 'Cyberpunk city vibes.',
    coverUrl: getImg(IMAGES.CYBER_CITY),
    songs: MOCK_SONGS.slice(8, 12)
  },
  {
    id: 'a2',
    title: 'Deep Focus',
    description: 'Keep calm and focus.',
    coverUrl: getImg('focus-work'),
    songs: MOCK_SONGS.slice(0, 1)
  },
  {
    id: 'a3',
    title: 'Peaceful Piano',
    description: 'Beautiful piano pieces.',
    coverUrl: getImg(IMAGES.PIANO),
    songs: MOCK_SONGS.slice(2, 3)
  },
  {
    id: 'a4',
    title: 'Retro Wave',
    description: 'Synthwave classics.',
    coverUrl: getImg(IMAGES.NEON_SIGN),
    songs: MOCK_SONGS.slice(4, 5)
  }
];

export const MOCK_ARTISTS = [
  { name: 'Ngọt', img: getImg('artist-ngot') },
  { name: 'Vũ Cát Tường', img: getImg('artist-vucattuong') },
  { name: 'Kai Đinh', img: getImg('artist-kaidinh') },
  { name: 'Ed Sheeran', img: getImg('artist-edsheeran') },
  { name: 'Billie Eilish', img: getImg('artist-billie') },
  { name: 'Coldplay', img: getImg('artist-coldplay') },
  { name: 'Ludovico Einaudi', img: getImg('artist-ludovico') },
  { name: 'Yiruma', img: getImg('artist-yiruma') },
  { name: 'Bon Iver', img: getImg('artist-boniver') },
  { name: 'Petit Biscuit', img: getImg('artist-petit') },
  { name: 'Marconi Union', img: getImg('artist-marconi') }
];

export const MOCK_RADIO: RadioStation[] = [
  {
    id: 'r1',
    name: 'White Noise Sleep',
    description: 'Pure static for deep sleep.',
    coverUrl: getImg('white-noise'),
    live: true,
    listeners: '50k'
  },
  {
    id: 'r2',
    name: 'Rain Sounds',
    description: 'Heavy rain & thunder.',
    coverUrl: getImg('rain-thunder'),
    live: true,
    listeners: '35k'
  },
  {
    id: 'r3',
    name: 'Forest Ambience',
    description: 'Birds & wind sounds.',
    coverUrl: getImg('forest-nature'),
    live: true,
    listeners: '15k'
  }
];

export const MOCK_PLAYLISTS: Playlist[] = [
  { id: 'p1', title: 'Sleep Soundly', description: 'Drift off with these gentle tracks.', coverUrl: getImg('sleep-soundly'), songs: [] },
  { id: 'p2', title: 'Morning Coffee', description: 'Soft acoustic for a good start.', coverUrl: getImg('coffee-cup'), songs: [] },
  { id: 'p3', title: 'Rainy Day Jazz', description: 'Smooth jazz for gray skies.', coverUrl: getImg('jazz-sax'), songs: [] },
  { id: 'p4', title: 'Nature Sounds', description: 'Connect with mother earth.', coverUrl: getImg('nature-earth'), songs: [] }
];

export const GENRES = [
  'Chill', 'Lo-fi', 'Acoustic', 'Ambient', 'Piano', 'Jazz', 'Classical', 'Indie Folk', 'Soul', 'Sleep', 'V-Pop'
];

export const GENRE_SEEDS = [
  'chill-music', 'lofi-beats', 'acoustic-guitar', 'ambient-space', 'grand-piano', 'jazz-club', 'classical-violin', 'indie-folk', 'soul-singer', 'sleeping-cat', 'vietnam-pop'
];

export const SUGGESTED_SEARCHES = [
  "Lo-fi beats", "Piano solo", "Rain sounds", "Acoustic covers", "Meditation guide", "Ngọt", "Vũ Cát Tường"
];

export const SUGGESTED_PROMPTS = [
  "A soothing lo-fi beat for studying",
  "Gentle acoustic guitar with bird sounds",
  "Ambient space music for sleep",
  "Sad piano melody for rainy days",
  "Calm jazz for reading",
  "Meditation music with water sounds",
  "Soft lullaby for babies"
];
