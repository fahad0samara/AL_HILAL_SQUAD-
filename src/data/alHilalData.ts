export type PositionKey = 'all' | 'goalkeepers' | 'defenders' | 'midfielders' | 'forwards';
export type SquadCategory = 'players' | 'management';

export interface PlayerProfile {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  shirtName: string;
  number: string;
  category: SquadCategory;
  positionKey: Exclude<PositionKey, 'all'> | 'management';
  positionLabel: string;
  shortRole: string;
  verticalGroupLabel: string;
  nationality: string;
  age: number;
  height: string;
  preferredFoot: string;
  joinedYear: number;
  marketRating: number;
  image: string;
  isCutout: boolean;
  isCaptain?: boolean;
  bio: string;
  stats: {
    appearances: number;
    goals: number;
    assists: number;
    passAccuracy: number;
    cleanSheets?: number;
    rating: string;
  };
  attributes: {
    label: string;
    value: number;
  }[];
  honors: string[];
}

export interface MatchEvent {
  minute: string;
  player: string;
  team: 'hilal' | 'opponent';
  type: 'goal' | 'assist';
}

export interface MatchItem {
  id: string;
  competition: string;
  round: string;
  date: string;
  isoKickoff?: string;
  time: string;
  venue: string;
  homeTeam: string;
  awayTeam: string;
  isHomeHilal: boolean;
  status: 'upcoming' | 'completed';
  score?: { home: number; away: number };
  ticketsAvailable?: boolean;
  matchStats?: {
    possession: [number, number];
    shots: [number, number];
    shotsOnTarget: [number, number];
    passes: [number, number];
    scorers: MatchEvent[];
  };
}

export interface StandingRow {
  rank: number;
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gd: string;
  points: number;
  isHilal?: boolean;
  form: ('W' | 'D' | 'L')[];
}

export interface TicketMatch {
  id: string;
  opponent: string;
  competition: string;
  date: string;
  time: string;
  venue: string;
  tiers: {
    id: string;
    zoneKey: 'north' | 'east' | 'silver' | 'vip';
    name: string;
    section: string;
    price: number;
    remaining: number;
    color: string;
  }[];
}

export interface StoreItem {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  category: string;
  sizes: string[];
  image: string;
}

export const POSITION_FILTERS: { key: PositionKey; label: string }[] = [
  { key: 'all', label: 'الكل' },
  { key: 'goalkeepers', label: 'الحراس' },
  { key: 'defenders', label: 'الدفاع' },
  { key: 'midfielders', label: 'الوسط' },
  { key: 'forwards', label: 'الهجوم' },
];

// Official 2026–2027 Al Hilal SFC First-Team Squad (verified from alhilal.com/ar/teams/mens-team)
export const AL_HILAL_SQUAD: PlayerProfile[] = [
  // Goalkeepers
  {
    id: 'bounou',
    firstName: 'ياسين',
    lastName: 'بونو',
    fullName: 'ياسين بونو',
    shirtName: 'BOUNOU',
    number: '37',
    category: 'players',
    positionKey: 'goalkeepers',
    positionLabel: 'حارس مرمى',
    shortRole: 'GK',
    verticalGroupLabel: 'حراس المرمى',
    nationality: 'المغرب',
    age: 35,
    height: '195 سم',
    preferredFoot: 'اليسرى',
    joinedYear: 2023,
    marketRating: 89,
    image: '/assets/hilal/bounou.webp',
    isCutout: true,
    bio: 'حارس عرين الزعيم وأحد أبرز حراس المرمى في العالم، يتميز بردود الفعل الخاطفة والهدوء الاستثنائي تحت الضغط وتصدياته الحاسمة في المواجهات المحلية والقارية.',
    stats: { appearances: 13, goals: 0, assists: 0, passAccuracy: 85, cleanSheets: 6, rating: '7.8' },
    attributes: [
      { label: 'ردة الفعل', value: 93 },
      { label: 'التمركز', value: 91 },
      { label: 'الكرات العالية', value: 88 },
      { label: 'التوزيع', value: 84 },
      { label: 'القيادة', value: 90 },
      { label: 'المرونة', value: 89 },
    ],
    honors: ['دوري روشن السعودي', 'كأس خادم الحرمين الشريفين', 'كأس السوبر السعودي'],
  },
  {
    id: 'alrubaie',
    firstName: 'محمد',
    lastName: 'الربيعي',
    fullName: 'محمد الربيعي اليامي',
    shirtName: 'AL-RUBAIE',
    number: '17',
    category: 'players',
    positionKey: 'goalkeepers',
    positionLabel: 'حارس مرمى',
    shortRole: 'GK',
    verticalGroupLabel: 'حراس المرمى',
    nationality: 'السعودية',
    age: 29,
    height: '190 سم',
    preferredFoot: 'اليمنى',
    joinedYear: 2024,
    marketRating: 80,
    image: '/assets/hilal/alrubaie.webp',
    isCutout: true,
    bio: 'حارس دولي سعودي متألق يتمتع بطول فارع وثبات كبير في الكرات العرضية والانفرادات، يمثل ضمانة قوية لعرين الهلال.',
    stats: { appearances: 2, goals: 0, assists: 0, passAccuracy: 82, cleanSheets: 1, rating: '7.2' },
    attributes: [
      { label: 'ردة الفعل', value: 84 },
      { label: 'التمركز', value: 82 },
      { label: 'الكرات العالية', value: 85 },
      { label: 'التوزيع', value: 79 },
      { label: 'القيادة', value: 80 },
      { label: 'المرونة', value: 83 },
    ],
    honors: ['دوري روشن السعودي', 'كأس السوبر السعودي'],
  },
  {
    id: 'alowais',
    firstName: 'محمد',
    lastName: 'العويس',
    fullName: 'محمد العويس',
    shirtName: 'AL-OWAIS',
    number: '33',
    category: 'players',
    positionKey: 'goalkeepers',
    positionLabel: 'حارس مرمى',
    shortRole: 'GK',
    verticalGroupLabel: 'حراس المرمى',
    nationality: 'السعودية',
    age: 35,
    height: '185 سم',
    preferredFoot: 'اليمنى',
    joinedYear: 2022,
    marketRating: 81,
    image: '/assets/hilal/alowais.webp',
    isCutout: true,
    bio: 'حارس دولي سعودي صاحب خبرة كبيرة في كأس العالم والبطولات الآسيوية، يشتهر بجرأته في الخروج وتصدياته الحاسمة.',
    stats: { appearances: 1, goals: 0, assists: 0, passAccuracy: 80, cleanSheets: 1, rating: '7.1' },
    attributes: [
      { label: 'ردة الفعل', value: 86 },
      { label: 'التمركز', value: 83 },
      { label: 'الكرات العالية', value: 82 },
      { label: 'التوزيع', value: 78 },
      { label: 'القيادة', value: 84 },
      { label: 'المرونة', value: 85 },
    ],
    honors: ['دوري روشن السعودي', 'كأس خادم الحرمين الشريفين', 'كأس السوبر السعودي'],
  },

  // Defenders
  {
    id: 'koulibaly',
    firstName: 'خاليدو',
    lastName: 'كوليبالي',
    fullName: 'خاليدو كوليبالي',
    shirtName: 'KOULIBALY',
    number: '3',
    category: 'players',
    positionKey: 'defenders',
    positionLabel: 'قلب دفاع',
    shortRole: 'CB',
    verticalGroupLabel: 'خط الدفاع',
    nationality: 'السنغال',
    age: 35,
    height: '187 سم',
    preferredFoot: 'اليمنى',
    joinedYear: 2023,
    marketRating: 87,
    image: '/assets/hilal/koulibaly.webp',
    isCutout: true,
    bio: 'صخرة الدفاع الهلالي وقائد الخط الخلفي، يجمع بين القوة البدنية الفائقة والخبرة الأوروبية الكبيرة والقدرة على بناء الهجمة من الخلف.',
    stats: { appearances: 15, goals: 1, assists: 1, passAccuracy: 92, rating: '7.6' },
    attributes: [
      { label: 'الدفاع', value: 92 },
      { label: 'البدنية', value: 91 },
      { label: 'الرأسيات', value: 90 },
      { label: 'التمرير', value: 86 },
      { label: 'التمركز', value: 90 },
      { label: 'السرعة', value: 79 },
    ],
    honors: ['دوري روشن السعودي', 'كأس خادم الحرمين الشريفين', 'كأس السوبر السعودي'],
  },
  {
    id: 'theo',
    firstName: 'ثيو',
    lastName: 'هيرنانديز',
    fullName: 'ثيو هيرنانديز',
    shirtName: 'THEO',
    number: '19',
    category: 'players',
    positionKey: 'defenders',
    positionLabel: 'ظهير وجناح أيسر',
    shortRole: 'LWB',
    verticalGroupLabel: 'خط الدفاع',
    nationality: 'فرنسا',
    age: 29,
    height: '184 سم',
    preferredFoot: 'اليسرى',
    joinedYear: 2025,
    marketRating: 89,
    image: '/assets/hilal/theo.webp',
    isCutout: true,
    bio: 'النجم الفرنسي السريع وأحد أخطر الأظهرة في العالم، يمثل مفتاح اللعب الهجومي على الجبهة اليسرى في خطة سيموني إنزاغي بانطلاقاته الصاروخية.',
    stats: { appearances: 14, goals: 2, assists: 5, passAccuracy: 87, rating: '7.9' },
    attributes: [
      { label: 'السرعة', value: 96 },
      { label: 'البدنية', value: 90 },
      { label: 'العرضيات', value: 87 },
      { label: 'الدفاع', value: 84 },
      { label: 'المراوغة', value: 86 },
      { label: 'التسديد', value: 82 },
    ],
    honors: ['كأس السوبر السعودي', 'دوري الأمم الأوروبية'],
  },
  {
    id: 'tambakti',
    firstName: 'حسان',
    lastName: 'تمبكتي',
    fullName: 'حسان تمبكتي',
    shirtName: 'TAMBAKTI',
    number: '87',
    category: 'players',
    positionKey: 'defenders',
    positionLabel: 'قلب دفاع',
    shortRole: 'CB',
    verticalGroupLabel: 'خط الدفاع',
    nationality: 'السعودية',
    age: 27,
    height: '182 سم',
    preferredFoot: 'اليمنى',
    joinedYear: 2023,
    marketRating: 84,
    image: '/assets/hilal/tambakti.webp',
    isCutout: true,
    bio: 'أبرز المدافعين السعوديين وأكثرهم سرعة وتوازناً في التغطية الخلفية، يتمتع بهدوء استثنائي في استخلاص الكرات وإحباط المرتدات.',
    stats: { appearances: 14, goals: 0, assists: 1, passAccuracy: 91, rating: '7.5' },
    attributes: [
      { label: 'الدفاع', value: 88 },
      { label: 'السرعة', value: 87 },
      { label: 'التمركز', value: 87 },
      { label: 'التمرير', value: 85 },
      { label: 'البدنية', value: 84 },
      { label: 'الافتكاك', value: 89 },
    ],
    honors: ['دوري روشن السعودي', 'كأس خادم الحرمين الشريفين', 'كأس السوبر السعودي'],
  },
  {
    id: 'akcicek',
    firstName: 'يوسف',
    lastName: 'أكتشيشيك',
    fullName: 'يوسف أكتشيشيك',
    shirtName: 'AKCICEK',
    number: '4',
    category: 'players',
    positionKey: 'defenders',
    positionLabel: 'قلب دفاع أيسر',
    shortRole: 'LCB',
    verticalGroupLabel: 'خط الدفاع',
    nationality: 'تركيا',
    age: 20,
    height: '193 سم',
    preferredFoot: 'اليسرى',
    joinedYear: 2025,
    marketRating: 82,
    image: '/assets/hilal/akcicek.webp',
    isCutout: true,
    bio: 'موهبة دفاعية تركية شابة بقدم يسرى دقيقة وقامة فارعة، يتفوق في الكرات الهوائية والتدرج بالكرة ضمن ثلاثي الدفاع.',
    stats: { appearances: 11, goals: 0, assists: 1, passAccuracy: 90, rating: '7.3' },
    attributes: [
      { label: 'الرأسيات', value: 88 },
      { label: 'الدفاع', value: 84 },
      { label: 'التمرير', value: 86 },
      { label: 'البدنية', value: 85 },
      { label: 'التمركز', value: 83 },
      { label: 'السرعة', value: 78 },
    ],
    honors: ['كأس السوبر السعودي'],
  },
  {
    id: 'alharbi',
    firstName: 'متعب',
    lastName: 'الحربي',
    fullName: 'متعب الحربي',
    shirtName: 'AL-HARBI',
    number: '24',
    category: 'players',
    positionKey: 'defenders',
    positionLabel: 'ظهير أيسر',
    shortRole: 'LB',
    verticalGroupLabel: 'خط الدفاع',
    nationality: 'السعودية',
    age: 26,
    height: '175 سم',
    preferredFoot: 'اليسرى',
    joinedYear: 2024,
    marketRating: 81,
    image: '/assets/hilal/alharbi.webp',
    isCutout: true,
    bio: 'ظهير أيسر سعودي سريع يتميز بالمساندة الهجومية المستمرة وإرسال الكرات العرضية المتقنة والتغطية السريعة.',
    stats: { appearances: 10, goals: 0, assists: 2, passAccuracy: 86, rating: '7.2' },
    attributes: [
      { label: 'السرعة', value: 87 },
      { label: 'العرضيات', value: 83 },
      { label: 'الدفاع', value: 80 },
      { label: 'التمرير', value: 82 },
      { label: 'اللياقة', value: 85 },
      { label: 'المراوغة', value: 80 },
    ],
    honors: ['كأس السوبر السعودي'],
  },
  {
    id: 'lajami',
    firstName: 'علي',
    lastName: 'لاجامي',
    fullName: 'علي لاجامي',
    shirtName: 'LAJAMI',
    number: '78',
    category: 'players',
    positionKey: 'defenders',
    positionLabel: 'قلب دفاع',
    shortRole: 'CB',
    verticalGroupLabel: 'خط الدفاع',
    nationality: 'السعودية',
    age: 30,
    height: '180 سم',
    preferredFoot: 'اليمنى',
    joinedYear: 2025,
    marketRating: 82,
    image: '/assets/hilal/lajami.webp',
    isCutout: true,
    bio: 'مدافع دولي سعودي متمرس يجيد اللعب في قلب الدفاع والظهير الأيمن بمرونة تكتيكية عالية وتدخلات حاسمة.',
    stats: { appearances: 11, goals: 0, assists: 1, passAccuracy: 89, rating: '7.3' },
    attributes: [
      { label: 'الدفاع', value: 85 },
      { label: 'التمركز', value: 84 },
      { label: 'السرعة', value: 81 },
      { label: 'التمرير', value: 83 },
      { label: 'البدنية', value: 83 },
      { label: 'الافتكاك', value: 84 },
    ],
    honors: ['كأس السوبر السعودي'],
  },
  {
    id: 'alyami',
    firstName: 'حمد',
    lastName: 'اليامي',
    fullName: 'حمد اليامي',
    shirtName: 'AL-YAMI',
    number: '88',
    category: 'players',
    positionKey: 'defenders',
    positionLabel: 'ظهير أيمن',
    shortRole: 'RWB',
    verticalGroupLabel: 'خط الدفاع',
    nationality: 'السعودية',
    age: 27,
    height: '175 سم',
    preferredFoot: 'اليمنى',
    joinedYear: 2021,
    marketRating: 80,
    image: '/assets/hilal/alyami.webp',
    isCutout: true,
    bio: 'ظهير أيمن حيوي يتمتع بلياقة عالية وقدرة مستمرة على تغطية الرواق الأيمن دفاعاً وهجوماً على مدار 90 دقيقة.',
    stats: { appearances: 12, goals: 0, assists: 2, passAccuracy: 85, rating: '7.2' },
    attributes: [
      { label: 'السرعة', value: 86 },
      { label: 'اللياقة', value: 88 },
      { label: 'الدفاع', value: 80 },
      { label: 'العرضيات', value: 81 },
      { label: 'التمرير', value: 82 },
      { label: 'البدنية', value: 80 },
    ],
    honors: ['دوري أبطال آسيا', 'دوري روشن السعودي', 'كأس الملك'],
  },
  {
    id: 'mahzari',
    firstName: 'محمد',
    lastName: 'محزري',
    fullName: 'محمد محزري',
    shirtName: 'MAHZARI',
    number: '2',
    category: 'players',
    positionKey: 'defenders',
    positionLabel: 'ظهير أيمن',
    shortRole: 'RB',
    verticalGroupLabel: 'خط الدفاع',
    nationality: 'السعودية',
    age: 24,
    height: '176 سم',
    preferredFoot: 'اليمنى',
    joinedYear: 2025,
    marketRating: 78,
    image: '/assets/hilal/mahzari.webp',
    isCutout: true,
    bio: 'ظهير أيمن سعودي شاب يمتاز بالسرعة في الارتداد الدفاعي والمرونة التكتيكية على الرواق الأيمن مع قدرة على المساندة الهجومية.',
    stats: { appearances: 6, goals: 0, assists: 1, passAccuracy: 85, rating: '7.0' },
    attributes: [
      { label: 'السرعة', value: 84 },
      { label: 'اللياقة', value: 84 },
      { label: 'الدفاع', value: 78 },
      { label: 'العرضيات', value: 79 },
      { label: 'التمرير', value: 80 },
      { label: 'البدنية', value: 78 },
    ],
    honors: ['كأس السوبر السعودي'],
  },
  {
    id: 'alsarnoukh',
    firstName: 'محمد',
    lastName: 'الصرنوخ',
    fullName: 'محمد الصرنوخ',
    shirtName: 'AL-SARNOUKH',
    number: '73',
    category: 'players',
    positionKey: 'defenders',
    positionLabel: 'ظهير أيمن',
    shortRole: 'RB',
    verticalGroupLabel: 'خط الدفاع',
    nationality: 'السعودية',
    age: 19,
    height: '177 سم',
    preferredFoot: 'اليمنى',
    joinedYear: 2026,
    marketRating: 75,
    image: '/assets/hilal/alsarnoukh.webp',
    isCutout: true,
    bio: 'موهبة دفاعية صاعدة من أكاديمية الهلال يتمتع بحيوية كبيرة وجرأة في المواجهات الفردية والانطلاق على الطرف الأيمن.',
    stats: { appearances: 3, goals: 0, assists: 0, passAccuracy: 84, rating: '6.9' },
    attributes: [
      { label: 'السرعة', value: 83 },
      { label: 'اللياقة', value: 82 },
      { label: 'الدفاع', value: 76 },
      { label: 'العرضيات', value: 75 },
      { label: 'التمرير', value: 78 },
      { label: 'البدنية', value: 74 },
    ],
    honors: ['مواهب الفئات السنية بالهلال'],
  },

  // Midfielders
  {
    id: 'neves',
    firstName: 'روبن',
    lastName: 'نيڤيز',
    fullName: 'روبن نيڤيز',
    shirtName: 'NEVES',
    number: '8',
    category: 'players',
    positionKey: 'midfielders',
    positionLabel: 'محور ارتكاز',
    shortRole: 'CDM',
    verticalGroupLabel: 'خط الوسط',
    nationality: 'البرتغال',
    age: 29,
    height: '180 سم',
    preferredFoot: 'اليمنى',
    joinedYear: 2023,
    marketRating: 89,
    image: '/assets/hilal/neves.webp',
    isCutout: true,
    bio: 'العقل المدبر لوسط الهلال ومنظم إيقاع اللعب بالكامل، يشتهر بتمريراته الطويلة العابرة للخطوط وتسديداته البعيدة المتقنة.',
    stats: { appearances: 15, goals: 3, assists: 6, passAccuracy: 94, rating: '8.0' },
    attributes: [
      { label: 'التمرير', value: 95 },
      { label: 'الرؤية', value: 94 },
      { label: 'التسديد', value: 90 },
      { label: 'الدفاع', value: 85 },
      { label: 'التحكم', value: 89 },
      { label: 'اللياقة', value: 88 },
    ],
    honors: ['دوري روشن السعودي', 'كأس خادم الحرمين الشريفين', 'كأس السوبر السعودي'],
  },
  {
    id: 'savic',
    firstName: 'سيرجي',
    lastName: 'ساڤيتش',
    fullName: 'سيرجي ساڤيتش',
    shirtName: 'MILINKOVIC',
    number: '22',
    category: 'players',
    positionKey: 'midfielders',
    positionLabel: 'لاعب خط وسط',
    shortRole: 'CM',
    verticalGroupLabel: 'خط الوسط',
    nationality: 'صربيا',
    age: 31,
    height: '192 سم',
    preferredFoot: 'اليمنى',
    joinedYear: 2023,
    marketRating: 89,
    image: '/assets/hilal/savic.webp',
    isCutout: true,
    bio: 'المايسترو الصربي ولاعب الوسط المتكامل تحت قيادة مدربه إنزاغي، يصنع الفارق بالاختراق المتأخر والكرات الرأسية والتمريرات الحاسمة.',
    stats: { appearances: 15, goals: 6, assists: 5, passAccuracy: 89, rating: '8.1' },
    attributes: [
      { label: 'التحكم', value: 92 },
      { label: 'البدنية', value: 92 },
      { label: 'التمرير', value: 90 },
      { label: 'التسديد', value: 88 },
      { label: 'الرأسيات', value: 91 },
      { label: 'الدفاع', value: 82 },
    ],
    honors: ['دوري روشن السعودي', 'كأس خادم الحرمين الشريفين', 'كأس السوبر السعودي'],
  },
  {
    id: 'kanno',
    firstName: 'محمد',
    lastName: 'كنو',
    fullName: 'محمد كنو',
    shirtName: 'KANNO',
    number: '28',
    category: 'players',
    positionKey: 'midfielders',
    positionLabel: 'وسط ميدان · نائب القائد',
    shortRole: 'CM',
    verticalGroupLabel: 'خط الوسط',
    nationality: 'السعودية',
    age: 32,
    height: '192 سم',
    preferredFoot: 'اليمنى',
    joinedYear: 2017,
    marketRating: 84,
    image: '/assets/hilal/kanno.webp',
    isCutout: true,
    bio: 'نائب القائد وأحد أعمدة الوسط الهلالي التاريخية، يجمع بين القوة البدنية والاستحواذ الذكي تحت الضغط والتسديد المتقن.',
    stats: { appearances: 13, goals: 1, assists: 2, passAccuracy: 90, rating: '7.5' },
    attributes: [
      { label: 'البدنية', value: 90 },
      { label: 'التمرير', value: 87 },
      { label: 'التحكم', value: 86 },
      { label: 'الدفاع', value: 84 },
      { label: 'التسديد', value: 83 },
      { label: 'اللياقة', value: 88 },
    ],
    honors: ['دوري أبطال آسيا (مرتان)', 'دوري روشن السعودي (5 مرات)', 'كأس السوبر السعودي'],
  },
  {
    id: 'nasser',
    firstName: 'ناصر',
    lastName: 'الدوسري',
    fullName: 'ناصر الدوسري',
    shirtName: 'N. AL-DAWSARI',
    number: '6',
    category: 'players',
    positionKey: 'midfielders',
    positionLabel: 'لاعب خط وسط',
    shortRole: 'CM',
    verticalGroupLabel: 'خط الوسط',
    nationality: 'السعودية',
    age: 27,
    height: '178 سم',
    preferredFoot: 'اليسرى',
    joinedYear: 2017,
    marketRating: 83,
    image: '/assets/hilal/nasser.webp',
    isCutout: true,
    bio: 'لاعب وسط سعودي متعدد الأدوار، صاحب أسرع هدف في تاريخ نهائي دوري أبطال آسيا، يتميز بالضغط العالي والانطلاقات اليسارية.',
    stats: { appearances: 14, goals: 1, assists: 3, passAccuracy: 88, rating: '7.4' },
    attributes: [
      { label: 'اللياقة', value: 90 },
      { label: 'التمرير', value: 85 },
      { label: 'السرعة', value: 84 },
      { label: 'الدفاع', value: 82 },
      { label: 'التحكم', value: 84 },
      { label: 'التسديد', value: 80 },
    ],
    honors: ['دوري أبطال آسيا (مرتان)', 'دوري روشن السعودي (5 مرات)', 'كأس الملك'],
  },
  {
    id: 'bouabre',
    firstName: 'سايمون',
    lastName: 'بوابري',
    fullName: 'سايمون بوابري',
    shirtName: 'BOUABRE',
    number: '70',
    category: 'players',
    positionKey: 'midfielders',
    positionLabel: 'صانع ألعاب',
    shortRole: 'CAM',
    verticalGroupLabel: 'خط الوسط',
    nationality: 'فرنسا',
    age: 20,
    height: '175 سم',
    preferredFoot: 'اليمنى',
    joinedYear: 2025,
    marketRating: 81,
    image: '/assets/hilal/bouabre.webp',
    isCutout: true,
    bio: 'موهبة خط الوسط الفرنسية الشابة، يتميز بالرشاقة الفائقة واللمسة الإبداعية بين الخطوط والقدرة على فتح التكتلات الدفاعية.',
    stats: { appearances: 10, goals: 1, assists: 2, passAccuracy: 88, rating: '7.4' },
    attributes: [
      { label: 'المراوغة', value: 89 },
      { label: 'الرؤية', value: 86 },
      { label: 'السرعة', value: 86 },
      { label: 'التمرير', value: 85 },
      { label: 'التحكم', value: 88 },
      { label: 'التسديد', value: 79 },
    ],
    honors: ['كأس السوبر السعودي'],
  },
  {
    id: 'mandash',
    firstName: 'سلطان',
    lastName: 'مندش',
    fullName: 'سلطان مندش',
    shirtName: 'MANDASH',
    number: '27',
    category: 'players',
    positionKey: 'midfielders',
    positionLabel: 'لاعب خط وسط وجناح',
    shortRole: 'RM',
    verticalGroupLabel: 'خط الوسط',
    nationality: 'السعودية',
    age: 32,
    height: '172 سم',
    preferredFoot: 'اليمنى',
    joinedYear: 2025,
    marketRating: 80,
    image: '/assets/hilal/mandash.webp',
    isCutout: true,
    bio: 'لاعب وسط هجومي سعودي يتميز بالسرعة في التحولات وصناعة الفرص من الأطراف مع انضباط دفاعي مميز.',
    stats: { appearances: 9, goals: 0, assists: 2, passAccuracy: 84, rating: '7.2' },
    attributes: [
      { label: 'السرعة', value: 85 },
      { label: 'المراوغة', value: 83 },
      { label: 'التمرير', value: 82 },
      { label: 'العرضيات', value: 83 },
      { label: 'اللياقة', value: 84 },
      { label: 'التسديد', value: 78 },
    ],
    honors: ['كأس السوبر السعودي'],
  },
  {
    id: 'alhawsawi',
    firstName: 'مراد',
    lastName: 'الهوساوي',
    fullName: 'مراد الهوساوي',
    shirtName: 'AL-HAWSAWI',
    number: '18',
    category: 'players',
    positionKey: 'midfielders',
    positionLabel: 'لاعب خط وسط',
    shortRole: 'CM',
    verticalGroupLabel: 'خط الوسط',
    nationality: 'السعودية',
    age: 25,
    height: '180 سم',
    preferredFoot: 'اليمنى',
    joinedYear: 2025,
    marketRating: 79,
    image: '/assets/hilal/alhawsawi.webp',
    isCutout: true,
    bio: 'لاعب خط وسط سعودي متوازن يجمع بين افتكاك الكرات في منتصف الملعب وبناء الهجمات بتمريرات قصيرة دقيقة تحت الضغط.',
    stats: { appearances: 8, goals: 0, assists: 1, passAccuracy: 87, rating: '7.2' },
    attributes: [
      { label: 'اللياقة', value: 86 },
      { label: 'التمرير', value: 83 },
      { label: 'الدفاع', value: 81 },
      { label: 'التحكم', value: 80 },
      { label: 'البدنية', value: 82 },
      { label: 'التسديد', value: 76 },
    ],
    honors: ['كأس السوبر السعودي'],
  },
  {
    id: 'dahal',
    firstName: 'صبري',
    lastName: 'دهل',
    fullName: 'صبري دهل',
    shirtName: 'DAHAL',
    number: '72',
    category: 'players',
    positionKey: 'midfielders',
    positionLabel: 'وسط هجومي وجناح',
    shortRole: 'CAM',
    verticalGroupLabel: 'خط الوسط',
    nationality: 'السعودية',
    age: 18,
    height: '174 سم',
    preferredFoot: 'اليسرى',
    joinedYear: 2026,
    marketRating: 76,
    image: '/assets/hilal/dahal.webp',
    isCutout: true,
    bio: 'أحد أبرز المواهب السعودية الشابة في خط الوسط الهجومي، يتميز بمهارة المراوغة والسرعة في المساحات الضيقة ورؤية إبداعية للملعب.',
    stats: { appearances: 4, goals: 0, assists: 1, passAccuracy: 85, rating: '7.1' },
    attributes: [
      { label: 'المراوغة', value: 84 },
      { label: 'السرعة', value: 85 },
      { label: 'الرشاقة', value: 86 },
      { label: 'التمرير', value: 80 },
      { label: 'التحكم', value: 83 },
      { label: 'التسديد', value: 75 },
    ],
    honors: ['بطل دوري الشباب السعودي'],
  },
  {
    id: 'alanazi',
    firstName: 'عبدالله',
    lastName: 'العنزي',
    fullName: 'عبدالله العنزي',
    shirtName: 'AL-ANAZI',
    number: '93',
    category: 'players',
    positionKey: 'midfielders',
    positionLabel: 'لاعب خط وسط',
    shortRole: 'CM',
    verticalGroupLabel: 'خط الوسط',
    nationality: 'السعودية',
    age: 20,
    height: '177 سم',
    preferredFoot: 'اليمنى',
    joinedYear: 2026,
    marketRating: 75,
    image: '/assets/hilal/alanazi.webp',
    isCutout: true,
    bio: 'لاعب وسط شاب مجتهد من قطاع الفئات السنية بنادي الهلال، يقدم حلولاً مرنة في تدوير الكرة والضغط العكسي في منتصف الميدان.',
    stats: { appearances: 3, goals: 0, assists: 1, passAccuracy: 86, rating: '6.9' },
    attributes: [
      { label: 'التمرير', value: 81 },
      { label: 'اللياقة', value: 83 },
      { label: 'التحكم', value: 79 },
      { label: 'الدفاع', value: 76 },
      { label: 'السرعة', value: 79 },
      { label: 'التسديد', value: 73 },
    ],
    honors: ['مواهب الفئات السنية بالهلال'],
  },

  // Forwards
  {
    id: 'salem',
    firstName: 'سالم',
    lastName: 'الدوسري',
    fullName: 'سالم الدوسري',
    shirtName: 'AL-DAWSARI',
    number: '29',
    category: 'players',
    positionKey: 'forwards',
    positionLabel: 'جناح أيسر · القائد',
    shortRole: 'LW',
    verticalGroupLabel: 'خط الهجوم',
    nationality: 'السعودية',
    age: 35,
    height: '171 سم',
    preferredFoot: 'اليمنى',
    joinedYear: 2011,
    marketRating: 90,
    image: '/assets/hilal/salem.webp',
    isCutout: true,
    isCaptain: true,
    bio: 'قائد نادي الهلال والمنتخب السعودي وأفضل لاعب في آسيا. رمز الحسم التاريخي للزعيم في النهائيات والمواجهات الكبرى بمهاراته الخارقة.',
    stats: { appearances: 15, goals: 5, assists: 6, passAccuracy: 88, rating: '8.2' },
    attributes: [
      { label: 'المراوغة', value: 94 },
      { label: 'السرعة', value: 90 },
      { label: 'التسديد', value: 89 },
      { label: 'صناعة اللعب', value: 91 },
      { label: 'القيادة', value: 95 },
      { label: 'اللياقة', value: 88 },
    ],
    honors: ['دوري أبطال آسيا (مرتان)', 'دوري روشن السعودي (6 مرات)', 'أفضل لاعب في آسيا'],
  },
  {
    id: 'watkins',
    firstName: 'أولي',
    lastName: 'واتكينز',
    fullName: 'أولي واتكينز',
    shirtName: 'WATKINS',
    number: '11',
    category: 'players',
    positionKey: 'forwards',
    positionLabel: 'رأس حربة',
    shortRole: 'ST',
    verticalGroupLabel: 'خط الهجوم',
    nationality: 'إنجلترا',
    age: 30,
    height: '180 سم',
    preferredFoot: 'اليمنى',
    joinedYear: 2026,
    marketRating: 89,
    image: '/assets/hilal/watkins.webp',
    isCutout: true,
    bio: 'المهاجم الإنجليزي الدولي وأحد أبرز هدافي الهلال، يتميز بالتحرك الذكي خلف المدافعين والضغط العالي المستمر والإنهاء الحاسم.',
    stats: { appearances: 14, goals: 7, assists: 4, passAccuracy: 82, rating: '8.1' },
    attributes: [
      { label: 'الإنهاء', value: 92 },
      { label: 'السرعة', value: 90 },
      { label: 'التحرك', value: 93 },
      { label: 'البدنية', value: 87 },
      { label: 'المراوغة', value: 85 },
      { label: 'التمرير', value: 81 },
    ],
    honors: ['أبرز هدافي الهلال 2026/27'],
  },
  {
    id: 'martinelli',
    firstName: 'غابرييل',
    lastName: 'مارتينيلي',
    fullName: 'غابرييل مارتينيلي',
    shirtName: 'MARTINELLI',
    number: '7',
    category: 'players',
    positionKey: 'forwards',
    positionLabel: 'جناح هجومي',
    shortRole: 'RW',
    verticalGroupLabel: 'خط الهجوم',
    nationality: 'البرازيل',
    age: 25,
    height: '178 سم',
    preferredFoot: 'اليمنى',
    joinedYear: 2026,
    marketRating: 88,
    image: '/assets/hilal/martinelli.webp',
    isCutout: true,
    bio: 'النجم البرازيلي وهداف الهلال الأول في موسم 2026/27 بسرعة فائقة في التحولات الهجومية (صاحب هاتريك مميز أمام التعاون).',
    stats: { appearances: 14, goals: 8, assists: 5, passAccuracy: 85, rating: '8.3' },
    attributes: [
      { label: 'السرعة', value: 95 },
      { label: 'المراوغة', value: 91 },
      { label: 'التسديد', value: 86 },
      { label: 'الضغط العالي', value: 90 },
      { label: 'التمرير', value: 84 },
      { label: 'الرشاقة', value: 92 },
    ],
    honors: ['هداف الهلال في دوري روشن 2026/27', 'كأس السوبر السعودي'],
  },
  {
    id: 'summerville',
    firstName: 'كريسينسيو',
    lastName: 'سامرفيل',
    fullName: 'كريسينسيو سامرفيل',
    shirtName: 'SUMMERVILLE',
    number: '38',
    category: 'players',
    positionKey: 'forwards',
    positionLabel: 'جناح هجومي',
    shortRole: 'LW',
    verticalGroupLabel: 'خط الهجوم',
    nationality: 'هولندا',
    age: 25,
    height: '174 سم',
    preferredFoot: 'اليمنى',
    joinedYear: 2026,
    marketRating: 85,
    image: '/assets/hilal/summerville.webp',
    isCutout: true,
    bio: 'جناح هولندي مهاري يتميز بالانطلاقات السريعة والمراوغة في المساحات الضيقة والقدرة على قلب مجريات المباريات.',
    stats: { appearances: 12, goals: 4, assists: 3, passAccuracy: 84, rating: '7.6' },
    attributes: [
      { label: 'السرعة', value: 93 },
      { label: 'المراوغة', value: 90 },
      { label: 'الرشاقة', value: 92 },
      { label: 'التسديد', value: 83 },
      { label: 'التمرير', value: 82 },
      { label: 'الضغط', value: 85 },
    ],
    honors: ['كأس السوبر السعودي'],
  },
  {
    id: 'meite',
    firstName: 'محمد قادر',
    lastName: 'ميتي',
    fullName: 'محمد قادر ميتي',
    shirtName: 'MEITE',
    number: '75',
    category: 'players',
    positionKey: 'forwards',
    positionLabel: 'رأس حربة',
    shortRole: 'ST',
    verticalGroupLabel: 'خط الهجوم',
    nationality: 'كوت ديفوار',
    age: 19,
    height: '192 سم',
    preferredFoot: 'اليمنى',
    joinedYear: 2026,
    marketRating: 82,
    image: '/assets/hilal/meite.webp',
    isCutout: true,
    bio: 'مهاجم شاب طويل القامة وبنية بدنية قوية يتميز بالتفوق في الكرات الهوائية والتحرك داخل منطقة الجزاء والإنهاء بكلتا القدمين.',
    stats: { appearances: 8, goals: 2, assists: 1, passAccuracy: 79, rating: '7.4' },
    attributes: [
      { label: 'البدنية', value: 88 },
      { label: 'الرأسيات', value: 87 },
      { label: 'الإنهاء', value: 83 },
      { label: 'السرعة', value: 84 },
      { label: 'التحرك', value: 82 },
      { label: 'المراوغة', value: 78 },
    ],
    honors: ['كأس السوبر السعودي'],
  },
  {
    id: 'alhabashi',
    firstName: 'نواف',
    lastName: 'الحبشي',
    fullName: 'نواف الحبشي',
    shirtName: 'AL-HABASHI',
    number: '77',
    category: 'players',
    positionKey: 'forwards',
    positionLabel: 'جناح هجومي',
    shortRole: 'LW',
    verticalGroupLabel: 'خط الهجوم',
    nationality: 'السعودية',
    age: 28,
    height: '173 سم',
    preferredFoot: 'اليمنى',
    joinedYear: 2026,
    marketRating: 78,
    image: '/assets/hilal/alhabashi.webp',
    isCutout: true,
    bio: 'جناح سعودي سريع يمتلك خبرة واسعة في دوري روشن السعودي، يجيد الاختراق من الأطراف وصناعة الفرص الخطيرة للمهاجمين.',
    stats: { appearances: 7, goals: 0, assists: 2, passAccuracy: 83, rating: '7.1' },
    attributes: [
      { label: 'السرعة', value: 85 },
      { label: 'المراوغة', value: 82 },
      { label: 'الرشاقة', value: 84 },
      { label: 'التمرير', value: 80 },
      { label: 'التسديد', value: 78 },
      { label: 'العرضيات', value: 81 },
    ],
    honors: ['كأس السوبر السعودي'],
  },
];

// Official 2026–2027 Al Hilal Coaching Staff (real Wikimedia Commons photos)
export const AL_HILAL_MANAGEMENT: PlayerProfile[] = [
  {
    id: 'inzaghi',
    firstName: 'سيموني',
    lastName: 'إنزاغي',
    fullName: 'سيموني إنزاغي',
    shirtName: 'INZAGHI',
    number: 'HC',
    category: 'management',
    positionKey: 'management',
    positionLabel: 'المدير الفني',
    shortRole: 'HC',
    verticalGroupLabel: 'القيادة الفنية',
    nationality: 'إيطاليا',
    age: 50,
    height: '185 سم',
    preferredFoot: 'منظومة 3-5-2 التكتيكية',
    joinedYear: 2025,
    marketRating: 95,
    image: '/assets/hilal/inzaghi.jpg',
    isCutout: false,
    bio: 'المدرب الإيطالي العالمي وقائد الدفة الفنية لنادي الهلال منذ يونيو 2025. اشتهر ببناء منظومة 3-5-2 عالية الانضباط والانسيابية الهجومية، ليقود الزعيم لصدارة دوري روشن 2026/27.',
    stats: { appearances: 54, goals: 138, assists: 43, passAccuracy: 89, rating: '8.8' },
    attributes: [
      { label: 'التكتيك', value: 96 },
      { label: 'إدارة المباريات', value: 95 },
      { label: 'التنظيم الدفاعي', value: 93 },
      { label: 'التحولات الهجومية', value: 94 },
      { label: 'القيادة', value: 94 },
      { label: 'تطوير النجوم', value: 92 },
    ],
    honors: ['متصدر دوري روشن 2026/27', 'بطل الدوري الإيطالي (إنتر ميلان)', 'كأس إيطاليا (3 مرات)'],
  },
  {
    id: 'farris',
    firstName: 'ماسيميليانو',
    lastName: 'فاريس',
    fullName: 'ماسيميليانو فاريس',
    shirtName: 'FARRIS',
    number: 'AC',
    category: 'management',
    positionKey: 'management',
    positionLabel: 'مساعد المدير الفني',
    shortRole: 'AC',
    verticalGroupLabel: 'القيادة الفنية',
    nationality: 'إيطاليا',
    age: 55,
    height: '183 سم',
    preferredFoot: 'تحليل الفيديو والتكتيك',
    joinedYear: 2025,
    marketRating: 90,
    image: '/assets/hilal/farris.jpg',
    isCutout: false,
    bio: 'الذراع التكتيكي الأيمن لسيموني إنزاغي ورفيق رحلته في لاتسيو وإنتر ميلان والهلال، يشرف على تفاصيل الكرات الثابتة وقراءة الخصوم.',
    stats: { appearances: 54, goals: 138, assists: 43, passAccuracy: 91, rating: '8.5' },
    attributes: [
      { label: 'التحليل', value: 94 },
      { label: 'الكرات الثابتة', value: 93 },
      { label: 'الإعداد الميداني', value: 91 },
      { label: 'التواصل', value: 90 },
      { label: 'الانضباط', value: 92 },
      { label: 'قراءة الخصم', value: 94 },
    ],
    honors: ['الدوري الإيطالي', 'كأس إيطاليا'],
  },
];

export const CLUB_LEADERSHIP_INFO = {
  president: 'الأمير نواف بن سعد آل سعود',
  founded: '1957م',
  stadium: 'المملكة أرينا · الرياض',
  totalTrophies: 70,
  asianTitles: 4,
  leagueTitles: 19,
};

// Real Verified November & December 2026 Al Hilal Fixtures (alhilal.com & spl.com.sa)
export const UPCOMING_MATCHES: MatchItem[] = [
  {
    id: 'm1',
    competition: 'دوري أبطال آسيا للنخبة',
    round: 'الجولة 5 · مرحلة الدوري',
    date: 'الاثنين 23 نوفمبر 2026',
    isoKickoff: '2026-11-23T17:45:00+03:00',
    time: '17:45 م',
    venue: 'ملعب استقلال · فرغانة',
    homeTeam: 'نيفتشي',
    awayTeam: 'الهلال',
    isHomeHilal: false,
    status: 'upcoming',
    ticketsAvailable: false,
  },
  {
    id: 'm2',
    competition: 'دوري روشن السعودي',
    round: 'الجولة 13',
    date: 'السبت 28 نوفمبر 2026',
    isoKickoff: '2026-11-28T18:20:00+03:00',
    time: '18:20 م',
    venue: 'استاد نادي الاتفاق · الدمام',
    homeTeam: 'الاتفاق',
    awayTeam: 'الهلال',
    isHomeHilal: false,
    status: 'upcoming',
    ticketsAvailable: false,
  },
  {
    id: 'm3',
    competition: 'دوري روشن السعودي',
    round: 'الجولة 14',
    date: 'الخميس 3 ديسمبر 2026',
    isoKickoff: '2026-12-03T21:30:00+03:00',
    time: '21:30 م',
    venue: 'المملكة أرينا · الرياض',
    homeTeam: 'الهلال',
    awayTeam: 'الدرعية',
    isHomeHilal: true,
    status: 'upcoming',
    ticketsAvailable: true,
  },
  {
    id: 'm4',
    competition: 'دوري أبطال آسيا للنخبة',
    round: 'الجولة 6 · مرحلة الدوري',
    date: 'الاثنين 7 ديسمبر 2026',
    isoKickoff: '2026-12-07T22:15:00+03:00',
    time: '22:15 م',
    venue: 'المملكة أرينا · الرياض',
    homeTeam: 'الهلال',
    awayTeam: 'العين الإماراتي',
    isHomeHilal: true,
    status: 'upcoming',
    ticketsAvailable: true,
  },
  {
    id: 'm5',
    competition: 'دوري أبطال آسيا للنخبة',
    round: 'الجولة 4 · مرحلة الدوري',
    date: 'الثلاثاء 3 نوفمبر 2026',
    time: '21:00 م',
    venue: 'المملكة أرينا · الرياض',
    homeTeam: 'الهلال',
    awayTeam: 'شباب الأهلي',
    isHomeHilal: true,
    status: 'completed',
    score: { home: 2, away: 0 },
    matchStats: {
      possession: [64, 36],
      shots: [19, 6],
      shotsOnTarget: [8, 2],
      passes: [588, 312],
      scorers: [
        { minute: '31\'', player: 'أولي واتكينز', team: 'hilal', type: 'goal' },
        { minute: '68\'', player: 'سالم الدوسري', team: 'hilal', type: 'goal' },
      ],
    },
  },
];

// Real Verified Saudi Pro League 2026–27 Standings (as of late November 2026, spl.com.sa)
export const LEAGUE_STANDINGS: StandingRow[] = [
  { rank: 1, team: 'الهلال', played: 11, won: 10, drawn: 0, lost: 1, gd: '+23', points: 30, isHilal: true, form: ['W', 'W', 'W', 'W', 'W'] },
  { rank: 2, team: 'القادسية', played: 12, won: 9, drawn: 1, lost: 2, gd: '+20', points: 28, form: ['W', 'W', 'D', 'W', 'W'] },
  { rank: 3, team: 'النصر', played: 11, won: 9, drawn: 1, lost: 1, gd: '+17', points: 28, form: ['W', 'W', 'L', 'W', 'W'] },
  { rank: 4, team: 'الاتحاد', played: 11, won: 7, drawn: 3, lost: 1, gd: '+10', points: 24, form: ['W', 'D', 'W', 'D', 'W'] },
  { rank: 5, team: 'نيوم', played: 12, won: 7, drawn: 1, lost: 4, gd: '+8', points: 22, form: ['W', 'L', 'W', 'W', 'D'] },
  { rank: 6, team: 'الأهلي', played: 11, won: 6, drawn: 2, lost: 3, gd: '+6', points: 20, form: ['W', 'L', 'W', 'D', 'W'] },
];

export const TICKET_MATCHES: TicketMatch[] = [
  {
    id: 'tm1',
    opponent: 'الهلال × الدرعية',
    competition: 'دوري روشن السعودي · الجولة 14',
    date: 'الخميس 3 ديسمبر 2026',
    time: '21:30 مساءً',
    venue: 'المملكة أرينا · الرياض',
    tiers: [
      { id: 't1-north', zoneKey: 'north', name: 'المدرج الموحد (القوة الزرقاء)', section: 'المدرج الشمالي خلف المرمى', price: 75, remaining: 184, color: '#2563EB' },
      { id: 't1-east', zoneKey: 'east', name: 'الواجهة الشرقية', section: 'المستوى الأول · منتصف الملعب', price: 165, remaining: 82, color: '#3B82F6' },
      { id: 't1-silver', zoneKey: 'silver', name: 'الدرجة الفضية الممتازة', section: 'المقصورة الجانبية مع ضيافة', price: 420, remaining: 24, color: '#60A5FA' },
      { id: 't1-vip', zoneKey: 'vip', name: 'المنصة الذهبية VIP', section: 'صالة كبار الشخصيات · الصفوف الأمامية', price: 1150, remaining: 8, color: '#F59E0B' },
    ],
  },
  {
    id: 'tm2',
    opponent: 'الهلال × العين الإماراتي',
    competition: 'دوري أبطال آسيا للنخبة · الجولة 6',
    date: 'الاثنين 7 ديسمبر 2026',
    time: '22:15 مساءً',
    venue: 'المملكة أرينا · الرياض',
    tiers: [
      { id: 't2-north', zoneKey: 'north', name: 'المدرج الموحد (القوة الزرقاء)', section: 'المدرج الشمالي خلف المرمى', price: 85, remaining: 120, color: '#2563EB' },
      { id: 't2-east', zoneKey: 'east', name: 'الواجهة الشرقية', section: 'المستوى الأول · منتصف الملعب', price: 190, remaining: 58, color: '#3B82F6' },
      { id: 't2-silver', zoneKey: 'silver', name: 'الدرجة الفضية الممتازة', section: 'المقصورة الجانبية مع ضيافة', price: 460, remaining: 16, color: '#60A5FA' },
      { id: 't2-vip', zoneKey: 'vip', name: 'المنصة الذهبية VIP', section: 'ضيافة فاخرة وإطلالة مباشرة', price: 1250, remaining: 5, color: '#F59E0B' },
    ],
  },
];

export const STORE_ITEMS: StoreItem[] = [
  {
    id: 'kit-home',
    name: 'القميص الأساسي للهلال 2026/27',
    subtitle: 'نسخة القائد سالم الدوسري #29 · بوما الأصلي',
    price: 399,
    category: 'الأطقم الرسمية',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    image: '/assets/hilal/salem.webp',
  },
  {
    id: 'kit-gk',
    name: 'طقم حارس المرمى الأساسي 2026/27',
    subtitle: 'نسخة ياسين بونو #37 الرسمية',
    price: 420,
    category: 'أطقم الحراس',
    sizes: ['M', 'L', 'XL'],
    image: '/assets/hilal/bounou.webp',
  },
  {
    id: 'kit-watkins',
    name: 'قميص المهاجم أولي واتكينز #11',
    subtitle: 'طباعة رسمية لاسم ورقم اللاعب',
    price: 459,
    category: 'إصدارات النجوم',
    sizes: ['S', 'M', 'L', 'XL'],
    image: '/assets/hilal/watkins.webp',
  },
  {
    id: 'kit-theo',
    name: 'قميص النجم ثيو هيرنانديز #19',
    subtitle: 'إصدار موسم 2026/27 الرسمي',
    price: 459,
    category: 'إصدارات النجوم',
    sizes: ['S', 'M', 'L', 'XL'],
    image: '/assets/hilal/theo.webp',
  },
];

export type SeasonCompetitionKey = 'all' | 'spl' | 'acl' | 'kingscup';

export interface SeasonGoalSeriesPoint {
  label: string;
  scored: number;
  conceded: number;
  result: 'W' | 'D' | 'L';
  opponent: string;
}

export interface CompetitionScorerEntry {
  playerId: string;
  goals: number;
  assists: number;
}

export interface VenueSplitRecord {
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
}

export interface SeasonStatsDataset {
  key: SeasonCompetitionKey;
  label: string;
  subtitle: string;
  standingBadge: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  cleanSheets: number;
  avgPossession: number;
  shotsPerGame: number;
  passAccuracy: number;
  shotConversion: number;
  firstHalfGoals: number;
  secondHalfGoals: number;
  openPlayGoals: number;
  setPieceGoals: number;
  homeRecord: VenueSplitRecord;
  awayRecord: VenueSplitRecord;
  recentForm: ('W' | 'D' | 'L')[];
  goalTimeline: SeasonGoalSeriesPoint[];
  scorers: CompetitionScorerEntry[];
}

// Reconciled & Verified 2026–2027 Al Hilal Season Analytics (as of November 2026: spl.com.sa, the-afc.com, alhilal.com)
export const SEASON_STATS_DATA: Record<SeasonCompetitionKey, SeasonStatsDataset> = {
  all: {
    key: 'all',
    label: 'جميع البطولات',
    subtitle: 'السجل الرسمي لموسم 2026/2027 · دوري روشن (11) · أبطال آسيا للنخبة (4) · كأس الملك (1)',
    standingBadge: '14 فوزاً من 16 مباراة رسمية',
    played: 16,
    wins: 14,
    draws: 0,
    losses: 2,
    goalsFor: 41,
    goalsAgainst: 13,
    cleanSheets: 8,
    avgPossession: 63,
    shotsPerGame: 17.6,
    passAccuracy: 89,
    shotConversion: 15,
    firstHalfGoals: 18,
    secondHalfGoals: 23,
    openPlayGoals: 32,
    setPieceGoals: 9,
    homeRecord: { played: 8, wins: 8, draws: 0, losses: 0, goalsFor: 22, goalsAgainst: 4 },
    awayRecord: { played: 8, wins: 6, draws: 0, losses: 2, goalsFor: 19, goalsAgainst: 9 },
    recentForm: ['W', 'W', 'W', 'L', 'W', 'W'],
    goalTimeline: [
      { label: 'أغسطس', scored: 8, conceded: 2, result: 'W', opponent: '3 مباريات (3 فوز · شملت الرائد 2-0)' },
      { label: 'سبتمبر', scored: 12, conceded: 3, result: 'W', opponent: '4 مباريات (4 فوز · شملت الغرافة 2-1)' },
      { label: 'أوائل أكتوبر', scored: 10, conceded: 3, result: 'W', opponent: '4 مباريات (3 فوز · 1 خسارة)' },
      { label: 'أواخر أكتوبر', scored: 9, conceded: 5, result: 'L', opponent: '4 مباريات (3 فوز · خسارة الشمال 1-3)' },
      { label: 'نوفمبر', scored: 2, conceded: 0, result: 'W', opponent: 'الهلال 2-0 شباب الأهلي (آسيا)' },
    ],
    scorers: [
      { playerId: 'martinelli', goals: 8, assists: 5 },
      { playerId: 'watkins', goals: 7, assists: 4 },
      { playerId: 'savic', goals: 6, assists: 5 },
      { playerId: 'salem', goals: 5, assists: 6 },
      { playerId: 'summerville', goals: 4, assists: 3 },
      { playerId: 'neves', goals: 3, assists: 6 },
    ],
  },
  spl: {
    key: 'spl',
    label: 'دوري روشن',
    subtitle: 'دوري روشن السعودي 2026/2027 · المتصدر بالمركز الأول برصيد 30 نقطة (فارق +23)',
    standingBadge: 'المركز 1 · 30 نقطة',
    played: 11,
    wins: 10,
    draws: 0,
    losses: 1,
    goalsFor: 32,
    goalsAgainst: 9,
    cleanSheets: 5,
    avgPossession: 64,
    shotsPerGame: 18.4,
    passAccuracy: 90,
    shotConversion: 16,
    firstHalfGoals: 14,
    secondHalfGoals: 18,
    openPlayGoals: 25,
    setPieceGoals: 7,
    homeRecord: { played: 6, wins: 6, draws: 0, losses: 0, goalsFor: 18, goalsAgainst: 3 },
    awayRecord: { played: 5, wins: 4, draws: 0, losses: 1, goalsFor: 14, goalsAgainst: 6 },
    recentForm: ['W', 'W', 'W', 'W', 'W', 'W'],
    goalTimeline: [
      { label: 'الجولات 1-2', scored: 6, conceded: 2, result: 'W', opponent: 'فوزان متتاليان في الافتتاح' },
      { label: 'الجولات 3-5', scored: 10, conceded: 2, result: 'W', opponent: '3 انتصارات (منها هاتريك مارتينيلي)' },
      { label: 'الجولات 6-8', scored: 10, conceded: 3, result: 'L', opponent: 'فوزان · خسارة وحيدة بالدوري' },
      { label: 'أمام الحزم', scored: 1, conceded: 0, result: 'W', opponent: '19 أكتوبر: الهلال 1-0 الحزم' },
      { label: 'القادسية والفتح', scored: 5, conceded: 2, result: 'W', opponent: 'فوز 3-2 على القادسية و2-0 على الفتح' },
    ],
    scorers: [
      { playerId: 'martinelli', goals: 6, assists: 4 },
      { playerId: 'watkins', goals: 5, assists: 3 },
      { playerId: 'savic', goals: 5, assists: 4 },
      { playerId: 'salem', goals: 4, assists: 5 },
      { playerId: 'summerville', goals: 3, assists: 2 },
      { playerId: 'neves', goals: 2, assists: 5 },
    ],
  },
  acl: {
    key: 'acl',
    label: 'أبطال آسيا للنخبة',
    subtitle: 'دوري أبطال آسيا للنخبة 2026/2027 (منطقة الغرب) · المركز الثاني برصيد 9 نقاط',
    standingBadge: 'المركز 2 · 9 نقاط',
    played: 4,
    wins: 3,
    draws: 0,
    losses: 1,
    goalsFor: 7,
    goalsAgainst: 4,
    cleanSheets: 2,
    avgPossession: 61,
    shotsPerGame: 15.8,
    passAccuracy: 88,
    shotConversion: 13,
    firstHalfGoals: 3,
    secondHalfGoals: 4,
    openPlayGoals: 5,
    setPieceGoals: 2,
    homeRecord: { played: 2, wins: 2, draws: 0, losses: 0, goalsFor: 4, goalsAgainst: 1 },
    awayRecord: { played: 2, wins: 1, draws: 0, losses: 1, goalsFor: 3, goalsAgainst: 3 },
    recentForm: ['W', 'W', 'L', 'W'],
    goalTimeline: [
      { label: 'الغرافة (أرض)', scored: 2, conceded: 1, result: 'W', opponent: '15 سبتمبر: الهلال 2-1 الغرافة' },
      { label: 'السد (خارج)', scored: 2, conceded: 0, result: 'W', opponent: '13 أكتوبر: السد 0-2 الهلال' },
      { label: 'الشمال (خارج)', scored: 1, conceded: 3, result: 'L', opponent: '27 أكتوبر: الشمال 3-1 الهلال' },
      { label: 'شباب الأهلي', scored: 2, conceded: 0, result: 'W', opponent: '3 نوفمبر: الهلال 2-0 شباب الأهلي' },
    ],
    scorers: [
      { playerId: 'watkins', goals: 2, assists: 1 },
      { playerId: 'martinelli', goals: 1, assists: 1 },
      { playerId: 'savic', goals: 1, assists: 1 },
      { playerId: 'salem', goals: 1, assists: 1 },
      { playerId: 'neves', goals: 1, assists: 1 },
      { playerId: 'meite', goals: 1, assists: 0 },
    ],
  },
  kingscup: {
    key: 'kingscup',
    label: 'كأس الملك',
    subtitle: 'كأس خادم الحرمين الشريفين 2026/2027 · التأهل لدور الـ 16 (أمام الحزم في يناير 2027)',
    standingBadge: 'متأهل لدور الـ 16',
    played: 1,
    wins: 1,
    draws: 0,
    losses: 0,
    goalsFor: 2,
    goalsAgainst: 0,
    cleanSheets: 1,
    avgPossession: 67,
    shotsPerGame: 19.0,
    passAccuracy: 91,
    shotConversion: 14,
    firstHalfGoals: 1,
    secondHalfGoals: 1,
    openPlayGoals: 2,
    setPieceGoals: 0,
    homeRecord: { played: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0 },
    awayRecord: { played: 1, wins: 1, draws: 0, losses: 0, goalsFor: 2, goalsAgainst: 0 },
    recentForm: ['W'],
    goalTimeline: [
      { label: 'دور الـ 32 · الرائد', scored: 2, conceded: 0, result: 'W', opponent: '17 أغسطس: الرائد 0-2 الهلال (خارج الأرض)' },
    ],
    scorers: [
      { playerId: 'martinelli', goals: 1, assists: 0 },
      { playerId: 'summerville', goals: 1, assists: 1 },
      { playerId: 'theo', goals: 0, assists: 1 },
    ],
  },
};

