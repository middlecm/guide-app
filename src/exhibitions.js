export const EXHIBITIONS = [
  {
    id: "bronze-gallery",
    title: "常設展｜吉金耀采",
    floor: "3F",
    rooms: ["305", "307"],
    location: "第一展覽館 305、307",
    duration: 60,
    crowd: "中",
    image: "8000126.jpg",
    tags: ["銅器"],
    description: "院藏銅器精華展。"
  },

  {
    id: "jade",
    title: "常設展｜敬天格物",
    floor: "3F",
    rooms: ["306", "308"],
    location: "第一展覽館 306、308",
    duration: 60,
    crowd: "中",
    image: "8000140.jpg",
    tags: ["玉器"],
    description: "中國玉器八千年發展史。"
  },

  {
    id: "ceramics",
    title: "常設展｜摶泥幻化",
    floor: "2F",
    rooms: ["201", "205", "207"],
    location: "第一展覽館 201、205、207",
    duration: 60,
    crowd: "中",
    image: "8000120.jpg",
    tags: ["陶瓷"],
    description: "中國陶瓷發展史。"
  },

  {
    id: "treasures",
    title: "常設展｜集瓊藻",
    floor: "1F",
    rooms: ["106"],
    location: "第一展覽館 106",
    duration: 75,
    crowd: "中",
    image: "8015630.jpg",
    tags: ["珍玩"],
    description: "院藏珍玩精華展。"
  },

  {
    id: "national-treasure",
    title: "特展｜國寶聚焦 2026-II",
    floor: "2F",
    rooms: ["208"],
    location: "第一展覽館 208",
    duration: 15,
    crowd: "中",
    image: "202604142.jpg",
    tags: ["書畫"],
    description: "每季聚焦一件國寶級作品。"
  }
];

export const ARTIFACTS = [
  {
    id: "maogongding",
    exhibitionId: "bronze-gallery",
    title: "西周晚期 毛公鼎",
    image: "II-11.jpg",
    order: 1,
    room: "305",
    floor: "3F",
    tag: "青銅器",
    audioDuration: "03:20",
    description: "內壁銘文近五百字，為現存最長青銅器銘文之一。"
  },

  {
    id: "song-pan",
    exhibitionId: "bronze-gallery",
    title: "西周晚期 散盤",
    image: "II-09.jpg",
    order: 2,
    room: "305",
    floor: "3F",
    tag: "青銅器",
    audioDuration: "03:00",
    description: "銘文記載土地轉讓，是西周契約文書的重要例證。"
  },

  {
    id: "jade-cong",
    exhibitionId: "jade",
    title: "良渚文化 玉琮",
    image: "II-04.jpg",
    order: 1,
    room: "306",
    floor: "3F",
    tag: "玉器",
    audioDuration: "03:00",
    description: "良渚文化代表玉禮器。"
  },

  {
    id: "jade-bixie",
    exhibitionId: "jade",
    title: "東漢 玉辟邪",
    image: "II-05.jpg",
    order: 2,
    room: "306",
    floor: "3F",
    tag: "玉器",
    audioDuration: "03:00",
    description: "漢代神獸造型玉雕。"
  },

  {
    id: "cabbage",
    exhibitionId: "national-treasure",
    title: "清 翠玉白菜",
    image: "II-01.jpg",
    order: 1,
    room: "208",
    floor: "2F",
    tag: "國寶",
    audioDuration: "03:00",
    description: "故宮最具代表性的國寶之一。"
  },

  {
    id: "meatstone",
    exhibitionId: "national-treasure",
    title: "清 肉形石",
    image: "II-02.jpg",
    order: 2,
    room: "208",
    floor: "2F",
    tag: "國寶",
    audioDuration: "03:00",
    description: "天然石材巧雕而成。"
  }
];