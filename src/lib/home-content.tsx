export type MediaLogo = { file: string; alt: string };

export const MEDIA_LOGOS: MediaLogo[] = [
  { file: "ravit.png", alt: "ラヴィット！" },
  { file: "suiyoubi-downtown.png", alt: "水曜日のダウンタウン" },
  { file: "zip.png", alt: "ZIP！" },
  { file: "matsuko-sekai.png", alt: "マツコの知らない世界" },
  { file: "ariyoshi-kabe.png", alt: "有吉の壁" },
  { file: "yofukashi.png", alt: "月曜から夜ふかし" },
  { file: "sukatto-japan.jpg", alt: "スカッとジャパン" },
  { file: "24h-tv.jpg", alt: "24時間テレビ" },
  { file: "vs-tamashii.jpg", alt: "VS魂" },
  { file: "jobtune.jpg", alt: "ジョブチューン" },
  { file: "taiikukai-tv.jpg", alt: "炎の体育会TV" },
  { file: "samaa-resort.jpg", alt: "世界さまぁ〜リゾート" },
  { file: "chidori-kamaitachi.png", alt: "千鳥かまいたちゴールデンアワー" },
  { file: "golden-sixtones.png", alt: "ゴールデンSixTONES" },
  { file: "snowman.png", alt: "それSnow Manにやらせて下さい" },
  { file: "arashi-shiyagare.jpg", alt: "嵐にしやがれ" },
  { file: "viking-more.png", alt: "バイキングMORE" },
  { file: "popup.png", alt: "ぽかぽか／ポップUP！" },
  { file: "quiz-iwakan.png", alt: "クイズ違和感" },
  { file: "pittanko.png", alt: "ぴったんこカン☆カン" },
  { file: "matsuko-kaigi.jpg", alt: "マツコ会議" },
  { file: "nippon-atama.jpg", alt: "ニッポン人の頭の中" },
  { file: "nobunaka.jpg", alt: "ノブナカなんなん？" },
  { file: "ueda-hoeru.png", alt: "上田と女が吠える夜" },
  { file: "minna-doubutsuen.jpg", alt: "嗚呼!!みんなの動物園" },
  { file: "doubutsu-peace.jpg", alt: "どうぶつピース!!" },
  { file: "zoo-1.jpg", alt: "Zoo-1グランプリ" },
  { file: "junk-sports.jpg", alt: "ジャンクSPORTS" },
  { file: "moshimo-tours.jpg", alt: "もしもツアーズ" },
  { file: "fns-27h.jpg", alt: "FNS27時間テレビ" },
  { file: "bakugai-star.jpg", alt: "爆買いスター恩返し" },
  { file: "chouzetsu-genkai.jpg", alt: "超絶限界" },
  { file: "hitomede-wakaru.jpg", alt: "ひと目でわかる!!" },
  { file: "torechaimashita.jpg", alt: "撮れちゃいました" },
  { file: "ganjitsu-surprise.jpg", alt: "元日サプライズ" },
  { file: "tokoro-japan.jpg", alt: "所JAPAN" },
  { file: "ntv-show.jpg", alt: "テレビ番組" },
];

export const MARQUEE_ROW_DURATIONS = ["72s", "88s", "64s", "94s", "78s"] as const;

export function splitMediaLogosIntoRows(logos: MediaLogo[], rowCount = 5): MediaLogo[][] {
  const rows: MediaLogo[][] = Array.from({ length: rowCount }, () => []);
  logos.forEach((logo, idx) => {
    rows[idx % rowCount].push(logo);
  });
  return rows;
}

export const CATEGORIES = [
  {
    name: "エキストラ",
    desc: "ドラマ・映画・CMの撮影に参加。未経験・学生も歓迎。",
    ring: "bg-telecareer-yellow",
    image: "/img/categories/extra.png",
    imageAlt: "ドラマ撮影現場で演技するエキストラの様子",
  },
  {
    name: "制作・AD",
    desc: "テレビ・映像制作のアシスタント。業界デビューの第一歩に。",
    ring: "bg-telecareer-orange",
    image: "/img/categories/production-ad.png",
    imageAlt: "番組収録現場で進行を支える制作アシスタント",
  },
  {
    name: "音響スタッフ",
    desc: "ライブ・イベントの音響設営やPA補助。研修ありの求人も。",
    ring: "bg-telecareer-coral",
    image: "/img/categories/sound.png",
    imageAlt: "ライブ会場でミキサーを操作する音響スタッフ",
  },
  {
    name: "照明スタッフ",
    desc: "ステージ・撮影現場のライティング。光で空間を演出。",
    ring: "bg-telecareer-green",
    image: "/img/categories/lighting.png",
    imageAlt: "ステージ照明をコントロールする照明スタッフ",
  },
  {
    name: "撮影・カメラ",
    desc: "番組・配信・Web動画の撮影サポートやカメラ補助。",
    ring: "bg-telecareer-yellow",
    image: "/img/categories/camera.png",
    imageAlt: "番組収録を撮影するカメラマン",
  },
  {
    name: "イベント運営",
    desc: "コンサート・イベントの設営や運営スタッフ。単発も多数。",
    ring: "bg-telecareer-coral",
    image: "/img/categories/event.png",
    imageAlt: "野外フェス会場で設営・運営を行うイベントスタッフ",
  },
];

export const WORKS = [
  { network: "日本テレビ", shows: ["世界の果てまでイッテQ!", "月曜から夜ふかし", "有吉の壁", "ZIP!"] },
  { network: "テレビ朝日", shows: ["ミュージックステーション", "ロンドンハーツ", "Qさま!!", "グッド！モーニング"] },
  { network: "TBSテレビ", shows: ["ラヴィット！", "水曜日のダウンタウン", "王様のブランチ"] },
  { network: "フジテレビ", shows: ["新しいカギ", "全力！脱力タイムズ", "めざましテレビ"] },
  { network: "ドラマ", shows: ["VIVANT", "ブラッシュアップライフ", "どうする家康"] },
  { network: "配信コンテンツ", shows: ["ABEMA", "Netflix", "TVer", "YouTube"] },
  { network: "CM", shows: ["大手広告会社・CM制作会社の現場"] },
  { network: "その他（テレビ東京・NHK 等）", shows: ["チコちゃんに叱られる！", "プレバト！！", "乃木坂工事中"] },
];

export const STEPS = [
  {
    no: "01",
    title: "無料で会員登録",
    body: "名前・連絡先などをご登録（1分）。費用は一切かかりません。",
    bg: "bg-telecareer-yellow",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-9 h-9">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <line x1="19" y1="8" x2="19" y2="14" />
        <line x1="22" y1="11" x2="16" y2="11" />
      </svg>
    ),
  },
  {
    no: "02",
    title: "キャリア相談・求人紹介",
    body: "アドバイザーがあなたの希望や適性をうかがい、ぴったりの求人をご紹介します。",
    bg: "bg-telecareer-coral",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-9 h-9">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    no: "03",
    title: "気になる求人に応募",
    body: "紹介された求人や気になる求人に応募。現場デビューまでサポートします。",
    bg: "bg-telecareer-green",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-9 h-9">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <polyline points="9 15 11 17 15 13" />
      </svg>
    ),
  },
] as const;

export const COMPANY_INFO: Record<string, string> = {
  商号: "株式会社フォーミュレーションI.T.S.",
  設立: "2011年",
  所在地: "東京都渋谷区東1-26-20 東京建物東渋谷ビル B1F",
  事業内容: "人材派遣業／有料職業紹介業／テレビ番組などメディアの企画制作",
  関連会社: "株式会社フォーミュレーション",
};
