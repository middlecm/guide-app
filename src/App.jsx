import React, { useEffect, useState } from "react";
import {
  Search,
  Home,
  Map,
  Star,
  Sparkles,
  MapPin,
  ChevronRight,
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  X,
  Share2,
  Building2,
  Trophy,
} from "lucide-react";
import { EXHIBITIONS, ARTIFACTS } from "./exhibitions";

const screens = [
  "splash",
  "home",
  "halls",
  "exhibition",
  "planning",
  "route",
  "map",
  "guide",
  "adjust",
  "report",
];

const exhibitionIconFallbacks = ["宮", "鼎", "經", "筆", "寶", "獸", "玉", "瓷", "珍", "佛", "書", "畫"];

function getPublicImagePath(fileName, folder = "exhibitions") {
  if (!fileName) return "";
  const name = String(fileName).trim();
  if (!name) return "";
  if (name.startsWith("/") || name.startsWith("http://") || name.startsWith("https://")) return name;
  const hasExtension = /\.[a-z0-9]+$/i.test(name);
  return `/${folder}/${hasExtension ? name : `${name}.jpg`}`;
}

const halls = EXHIBITIONS.map((item, index) => {
  const tags = Array.isArray(item.tags) ? item.tags : [];
  const highlights = Array.isArray(item.highlights) && item.highlights.length > 0 ? item.highlights : tags;
  const duration = Number(item.duration) || 45;

  return {
    ...item,
    id: item.id || `exhibition-${index + 1}`,
    title: item.fullTitle || item.title || item.name || `展覽 ${index + 1}`,
    shortTitle: item.title || item.fullTitle || item.name || `展覽 ${index + 1}`,
    time: `約 ${duration} 分鐘`,
    duration,
    crowd: item.crowd || "中",
    location: item.location || `${item.floor || ""} ${Array.isArray(item.rooms) ? item.rooms.join("、") : ""}`.trim(),
    floor: item.floor || "1F",
    rooms: Array.isArray(item.rooms) ? item.rooms : [],
    icon: item.icon || exhibitionIconFallbacks[index % exhibitionIconFallbacks.length],
    image: getPublicImagePath(item.image),
    description: item.summary || item.description || "尚未提供展覽簡介。",
    tags,
    highlight: highlights.slice(0, 3).map((name) => [name, String(name || item.icon || "展").slice(0, 1)]),
  };
});

const featured = halls.slice(0, 6).map((hall, index) => ({
  badge: index === 0 ? "本日精選" : hall.type || "推薦展覽",
  title: hall.shortTitle || hall.title,
  subtitle: `${hall.floor} ${hall.rooms?.join("、") || ""}・${hall.time}`,
  icon: hall.icon,
  exhibitionId: hall.id,
}));

function buildRouteStops(exhibitions, startHour = 13, startMinute = 0, limit = 5) {
  let totalMinutes = startHour * 60 + startMinute;
  const selected = exhibitions.slice(0, limit);
  const stops = selected.map((hall, index) => {
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    const time = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    totalMinutes += hall.duration || 30;
    return {
      time,
      title: hall.shortTitle || hall.title,
      loc: hall.location,
      mins: `${hall.duration || 30} 分鐘`,
      tag: index === 0 ? "從這裡開始" : hall.tags?.[0] || hall.type || "展覽",
      icon: hall.icon,
      target: index === 0 ? "guide" : undefined,
      exhibitionId: hall.id,
    };
  });
  const endHour = Math.floor(totalMinutes / 60);
  const endMinute = totalMinutes % 60;
  stops.push({
    time: `${String(endHour).padStart(2, "0")}:${String(endMinute).padStart(2, "0")}`,
    title: "行程結束",
    loc: "可自行延伸探索",
    mins: "",
    tag: "完成",
    icon: "旗",
  });
  return stops;
}

const routeStops = buildRouteStops(halls);

function cn(...items) {
  return items.filter(Boolean).join(" ");
}

function AppFrame({ children }) {
  return (
    <div className="mx-auto min-h-[100svh] w-full max-w-[430px] overflow-hidden bg-[#fbf8f1] text-[#123333] shadow-2xl sm:my-4 sm:min-h-[900px] sm:rounded-[34px]">
      <div className="relative min-h-[100svh] sm:min-h-[900px]">
        {children}
      </div>
    </div>
  );
}

function Header({ title, subtitle, onBack, right }) {
  return (
    <>
      <div className="flex items-center justify-between border-b border-[#e9decc] px-4 pb-3 pt-5">
        <button onClick={onBack} className="flex h-9 min-w-14 items-center gap-1 rounded-full text-sm font-bold text-[#064b4a]">
          {onBack && <ArrowLeft size={18} />}
          {onBack ? "返回" : ""}
        </button>
        <div className="flex-1 text-center">
          <h1 className="text-[17px] font-black tracking-wide text-[#123333]">{title}</h1>
          {subtitle && <p className="mt-0.5 text-[11px] text-[#8a7352]">{subtitle}</p>}
        </div>
        <div className="flex h-9 min-w-14 items-center justify-end gap-2 text-[#064b4a]">{right}</div>
      </div>
    </>
  );
}

function Seal() {
  return <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#b68a3a] text-3xl font-black text-[#b68a3a]">宮</div>;
}

function ArtThumb({ label, className }) {
  return (
    <div className={cn("flex items-center justify-center overflow-hidden rounded-2xl border border-[#e7dcc9] bg-gradient-to-br from-[#e9dcc6] via-[#f8f3e8] to-[#c6d5cf] text-2xl font-black text-[#6b5632]", className)}>
      {label}
    </div>
  );
}

function ImageThumb({ src, alt, label, className, imageClassName = "object-cover" }) {
  if (!src) return <ArtThumb label={label} className={className} />;

  return (
    <div className={cn("overflow-hidden rounded-2xl border border-[#e7dcc9] bg-[#f8f3e8]", className)}>
      <img
        src={src}
        alt={alt}
        className={cn("h-full w-full", imageClassName)}
        onError={(event) => {
          event.currentTarget.style.display = "none";
          event.currentTarget.nextElementSibling.style.display = "flex";
        }}
      />
      <div className="hidden h-full w-full items-center justify-center bg-gradient-to-br from-[#e9dcc6] via-[#f8f3e8] to-[#c6d5cf] text-2xl font-black text-[#6b5632]">
        {label}
      </div>
    </div>
  );
}

function Splash({ go }) {
  return (
    <AppFrame>
      <div className="relative min-h-[100svh] bg-[#f8f3e8] sm:min-h-[900px]">
        <div className="absolute inset-0 opacity-80">
          <div className="absolute -left-20 top-48 h-72 w-72 rounded-full bg-[#d7e3dc] blur-3xl" />
          <div className="absolute -right-24 top-28 h-80 w-80 rounded-full bg-[#ead7ad] blur-3xl" />
          <div className="absolute bottom-36 left-0 right-0 h-56 bg-gradient-to-t from-[#c6d3ce] to-transparent" />
        </div>
        <div className="relative flex min-h-[100svh] flex-col items-center px-8 pt-24 text-center sm:min-h-[900px]">
          <Seal />
          <div className="mt-10 text-4xl font-black leading-tight tracking-[0.18em] text-[#064b4a]">故宮導覽<br />AI 助手</div>
          <p className="mt-5 text-sm leading-7 tracking-[0.18em] text-[#8a7352]">讓 AI 陪你，看見更多<br />文物背後的故事</p>
          <div className="mt-14 h-40 w-full rounded-[32px] bg-gradient-to-b from-[#9ab5b1] to-[#f3eadb] p-4 shadow-inner">
            <div className="h-full rounded-[26px] bg-[linear-gradient(160deg,#ebdfc9,#b7c7bf,#e9dcc6)] p-5 text-left text-[#064b4a]">
              <div className="text-xs text-[#8a7352]">National Palace Museum</div>
              <div className="mt-4 text-2xl font-black">山水入館，文物有聲</div>
            </div>
          </div>
          <button onClick={() => go("home")} className="mb-10 mt-auto h-14 w-full rounded-full bg-[#064b4a] text-lg font-black tracking-widest text-white shadow-lg shadow-[#064b4a]/25">開始體驗</button>
        </div>
      </div>
    </AppFrame>
  );
}

function HomeScreen({ go, openExhibition }) {
  const [searchText, setSearchText] = useState("");

  const openFeatured = (item) => {
    const exhibition = halls.find((hall) => hall.id === item.exhibitionId) || halls[0];
    openExhibition(exhibition);
  };

  return (
    <AppFrame>
      <main className="h-[100svh] overflow-y-auto px-5 pb-10 pt-10 sm:h-[900px]">
        <div>
          <p className="text-sm text-[#8a7352]">午安，故宮探索者！</p>
          <h1 className="mt-1 text-2xl font-black text-[#123333]">今天想探索什麼？</h1>
        </div>

        <div className="mt-5 flex items-center gap-2 rounded-2xl border border-[#e7dcc9] bg-white px-4 py-3 shadow-sm">
          <Search size={18} className="shrink-0 text-[#8a7352]" />
          <input
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="搜尋展覽、文物或關鍵字"
            className="w-full bg-transparent text-sm text-[#123333] outline-none placeholder:text-[#9b927f]"
          />
          {searchText && (
            <button onClick={() => setSearchText("")} className="rounded-full bg-[#f3eadb] px-2 py-1 text-xs font-bold text-[#8a7352]">清除</button>
          )}
        </div>

        {searchText && (
          <div className="mt-3 rounded-2xl border border-[#e7dcc9] bg-white p-3 text-sm text-[#53656a] shadow-sm">
            搜尋「<b className="text-[#064b4a]">{searchText}</b>」：可前往展覽總覽查看相關展廳與文物。
          </div>
        )}

        <div className="mt-6 flex items-center justify-between">
          <h2 className="text-lg font-black text-[#123333]">本日精選</h2>
          <span className="text-xs text-[#8a7352]">左右滑動查看更多</span>
        </div>
        <div className="-mx-1 mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {featured.map((item) => (
            <button key={item.title} onClick={() => openFeatured(item)} className="w-[285px] shrink-0 snap-start overflow-hidden rounded-[28px] bg-[#143f3d] text-left text-white shadow-lg">
              <div className="grid grid-cols-[1fr_110px] gap-2 p-4">
                <div>
                  <div className="text-xs text-[#e8d5a8]">{item.badge}</div>
                  <div className="mt-1 text-xl font-black">{item.title}</div>
                  <p className="mt-2 text-xs leading-5 text-white/80">{item.subtitle}</p>
                  <span className="mt-4 inline-flex rounded-full bg-white/15 px-3 py-1 text-xs">立即查看</span>
                </div>
                <ArtThumb label={item.icon} className="h-28 bg-gradient-to-br from-[#e6eee6] to-[#8fb7a7] text-[#064b4a]" />
              </div>
            </button>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3">
          {[
            ["展覽總覽", Building2, "halls"],
            ["AI 規劃", Sparkles, "planning"],
            ["展區平面圖", Map, "map"],
          ].map(([label, Icon, target]) => (
            <button key={label} onClick={() => go(target)} className="rounded-2xl border border-[#e7dcc9] bg-white px-2 py-4 text-center shadow-sm">
              <Icon className="mx-auto text-[#064b4a]" size={22} />
              <div className="mt-2 text-xs font-bold text-[#123333]">{label}</div>
            </button>
          ))}
        </div>
      </main>
    </AppFrame>
  );
}

function HallsScreen({ go, back, openExhibition }) {
  return (
    <AppFrame>
      <Header title="今日展期中場館" subtitle="選擇想看的展覽，或由 AI 為你規劃路線" onBack={back} right={<Home size={18} onClick={() => go("home")} />} />
      <main className="px-5 pt-5">
        <div className="space-y-4">
          {halls.map((hall) => (
            <button key={hall.title} onClick={() => openExhibition(hall)} className="flex w-full items-center gap-4 rounded-3xl border border-[#e7dcc9] bg-white p-3 text-left shadow-sm">
              <ImageThumb src={hall.image} alt={hall.title} label={hall.icon} className="h-20 w-20 shrink-0" />
              <div className="flex-1">
                <h3 className="font-black text-[#123333]">{hall.title}</h3>
                <p className="mt-1 text-sm text-[#53656a]">{hall.time}</p>
                <p className="mt-1 flex items-center gap-1 text-xs text-[#064b4a]"><MapPin size={13} /> {hall.location}</p>
              </div>
              <div className="flex flex-col items-end gap-3">
                <span className={cn("rounded-full border px-2 py-1 text-xs", hall.crowd === "高" ? "border-red-200 bg-red-50 text-red-600" : hall.crowd === "低" ? "border-emerald-200 bg-emerald-50 text-emerald-600" : "border-amber-200 bg-amber-50 text-amber-600")}>人流：{hall.crowd}</span>
                <ChevronRight size={18} className="text-[#b68a3a]" />
              </div>
            </button>
          ))}
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button onClick={() => openExhibition(halls[0])} className="h-12 rounded-2xl border border-[#064b4a] bg-white font-bold text-[#064b4a]">查看展覽介紹</button>
          <button onClick={() => go("planning")} className="h-12 rounded-2xl bg-[#064b4a] font-bold text-white shadow-lg shadow-[#064b4a]/20">請 AI 規劃路線</button>
        </div>
      </main>
    </AppFrame>
  );
}

function ExhibitionScreen({ go, back, addFavorite, favorites, exhibition }) {
  const current = exhibition || halls[0];
  const exhibitionInfo = {
    ...current,
    highlight: current.id === "bronze" ? [["毛公鼎", "鼎"], ["散氏盤", "盤"], ["虎簋", "簋"]] : current.id === "frontier" ? [["陶俑", "俑"], ["邊境圖像", "界"], ["異域器物", "器"]] : current.id === "east-asia" ? [["青瓷", "瓷"], ["書卷", "卷"], ["佛像", "佛"]] : [["珍玩", "珍"], ["宮廷器物", "宮"], ["近代畫作", "畫"]],
  };
  const isFavorite = favorites.some((item) => item.id === exhibitionInfo.id);

  return (
    <AppFrame>
      <Header title="展覽介紹" onBack={back} right={<Map size={20} onClick={() => go("map")} />} />
      <main className="px-5 pt-5">
        <ImageThumb
          src={exhibitionInfo.image}
          alt={exhibitionInfo.title}
          label={exhibitionInfo.icon}
          className="h-52 w-full rounded-3xl text-5xl"
          imageClassName="object-cover"
        />
        <div className="mt-5 rounded-3xl border border-[#e7dcc9] bg-white p-5 shadow-sm">
          <h2 className="text-2xl font-black text-[#123333]">{exhibitionInfo.title}</h2>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-[#f3eadb] px-3 py-1 text-[#8a5d13]">推薦停留：{exhibitionInfo.time}</span>
            <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-600">人流：{exhibitionInfo.crowd}</span>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-[#064b4a]">展廳位置：{exhibitionInfo.location.replace("第一展覽館 ", "")}</span>
          </div>
          <h3 className="mt-5 font-bold text-[#123333]">展覽簡介</h3>
          <p className="mt-2 text-sm leading-7 text-[#53656a] whitespace-pre-line">{exhibitionInfo.description}</p>
          <h3 className="mt-5 font-bold text-[#123333]">亮點文物</h3>
          <div className="mt-3 grid grid-cols-3 gap-3">
            {exhibitionInfo.highlight.map(([name, label]) => (
              <div key={name}>
                <ArtThumb label={label} className="h-20" />
                <p className="mt-1 text-center text-xs text-[#53656a]">{name}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            onClick={() => addFavorite({ id: exhibitionInfo.id, title: exhibitionInfo.title, location: exhibitionInfo.location })}
            className={cn("h-12 rounded-2xl font-bold", isFavorite ? "bg-[#f3eadb] text-[#064b4a]" : "bg-[#064b4a] text-white")}
          >
            {isFavorite ? "已加入我的最愛" : "加入我的最愛"}
          </button>
          <button onClick={() => go("map")} className="h-12 rounded-2xl border border-[#064b4a] bg-white font-bold text-[#064b4a]">查看平面圖</button>
        </div>
      </main>
    </AppFrame>
  );
}

function PlanningScreen({ go, back, favorites }) {
  const [topics, setTopics] = useState(["明星文物"]);
  const [pace, setPace] = useState("高效精華");
  const [time, setTime] = useState("90 分鐘");
  const [must, setMust] = useState("必看鎮館之寶");
  const [selectedFavorites, setSelectedFavorites] = useState(favorites.map((item) => item.id));

  useEffect(() => {
    setSelectedFavorites((prev) => {
      const ids = favorites.map((item) => item.id);
      return Array.from(new Set([...prev, ...ids]));
    });
  }, [favorites]);

  const toggleTopic = (item) => {
    setTopics((prev) => {
      if (prev.includes(item)) return prev.filter((topic) => topic !== item);
      return [...prev, item];
    });
  };

  const toggleFavorite = (id) => {
    setSelectedFavorites((prev) => prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]);
  };

  const multiGroup = (label, items) => (
    <div className="mt-5">
      <div className="mb-2 text-sm font-black text-[#123333]">{label}</div>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => {
          const selected = topics.includes(item);
          return (
            <button key={item} onClick={() => toggleTopic(item)} className={cn("rounded-2xl border px-4 py-2 text-sm font-semibold", selected ? "border-[#064b4a] bg-[#064b4a] text-white shadow" : "border-[#e7dcc9] bg-white text-[#53656a]")}>{item}</button>
          );
        })}
      </div>
    </div>
  );

  const singleGroup = (label, items, value, setter) => (
    <div className="mt-5">
      <div className="mb-2 text-sm font-black text-[#123333]">{label}</div>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <button key={item} onClick={() => setter(item)} className={cn("rounded-2xl border px-4 py-2 text-sm font-semibold", value === item ? "border-[#064b4a] bg-[#064b4a] text-white shadow" : "border-[#e7dcc9] bg-white text-[#53656a]")}>{item}</button>
        ))}
      </div>
    </div>
  );

  return (
    <AppFrame>
      <Header title="AI 規劃｜專屬動線" onBack={back} right={<Sparkles size={20} />} />
      <main className="h-[calc(100svh-74px)] overflow-y-auto px-5 pb-8 pt-4 sm:h-[826px]">
        <div className="flex items-center justify-between rounded-2xl bg-[#f3eadb] px-4 py-3 text-xs font-bold text-[#8a7352]">
          {["1 主題", "2 最愛", "3 時間", "4 完成"].map((s, i) => <span key={s} className={i === 0 ? "text-[#064b4a]" : ""}>{s}</span>)}
        </div>
        {multiGroup("想看的主題（可複選）", ["明星文物", "書畫", "青銅器", "珍玩", "特展", "宗教雕塑", "宮廷生活"])}

        <div className="mt-5 rounded-3xl border border-[#e7dcc9] bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-black text-[#123333]">我的最愛</h3>
            <span className="text-xs text-[#8a7352]">勾選作為 AI 規劃參考</span>
          </div>
          {favorites.length === 0 ? (
            <div className="rounded-2xl bg-[#f3eadb] p-3 text-sm leading-6 text-[#53656a]">
              <p>你還沒有加入展覽。可以先到展覽介紹頁按「加入我的最愛」。</p>
              <button onClick={() => go("halls")} className="mt-3 h-11 w-full rounded-2xl bg-[#064b4a] font-black text-white">前往加入展覽</button>
            </div>
          ) : (
            <div className="space-y-2">
              {favorites.map((item) => (
                <label key={item.id} className="flex items-center gap-3 rounded-2xl border border-[#e7dcc9] bg-[#fffdf8] p-3">
                  <input
                    type="checkbox"
                    checked={selectedFavorites.includes(item.id)}
                    onChange={() => toggleFavorite(item.id)}
                    className="h-5 w-5 accent-[#064b4a]"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-black text-[#123333]">{item.title}</div>
                    <div className="mt-0.5 text-xs text-[#8a7352]">{item.location}</div>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        {singleGroup("參觀節奏", ["快速重點", "高效精華", "標準節奏", "輕鬆慢看", "深度沉浸"], pace, setPace)}
        {singleGroup("參觀時間", ["30 分鐘", "45 分鐘", "60 分鐘", "90 分鐘", "2 小時", "半日慢遊"], time, setTime)}
        {singleGroup("必看程度", ["必看鎮館之寶", "有經過可以", "冷門驚喜"], must, setMust)}
        <div className="mt-5 rounded-3xl border border-[#e7dcc9] bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 font-black text-[#123333]"><Sparkles size={18} className="text-[#b68a3a]" /> AI 推薦摘要</div>
          <p className="mt-3 text-sm leading-6 text-[#53656a]">將依據「{topics.join("、") || "未選主題"}」、{pace}、{time} 與你勾選的最愛展覽，生成適合現場移動的客製動線。</p>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs text-[#064b4a]">
            {routeStops.slice(0, 3).map((s) => <span key={s.title} className="rounded-xl bg-emerald-50 px-2 py-2">{s.title}</span>)}
          </div>
        </div>
        <button onClick={() => go("route")} className="mt-5 h-14 w-full rounded-2xl bg-[#064b4a] text-base font-black text-white shadow-lg shadow-[#064b4a]/20">生成我的客製動線</button>
      </main>
    </AppFrame>
  );
}

function RouteScreen({ go, back }) {
  return (
    <AppFrame>
      <Header title="你的客製動線" subtitle="總時長：約 90 分鐘" onBack={back} />
      <main className="px-5 pt-5">
        <div className="mb-4 flex items-center justify-between text-sm">
          <span className="font-bold text-[#064b4a]">今天預計看完：100%</span>
          <button onClick={() => go("map")} className="rounded-full border border-[#064b4a] px-3 py-1 font-bold text-[#064b4a]">查看平面圖</button>
        </div>
        <button onClick={() => go("guide")} className="mb-4 h-14 w-full rounded-2xl bg-[#064b4a] text-base font-black text-white shadow-lg shadow-[#064b4a]/20">
          開始聽導覽
        </button>
        <div className="space-y-4">
          {routeStops.map((stop, idx) => (
            <button key={stop.time + stop.title} onClick={() => stop.target ? go(stop.target) : null} className="grid w-full grid-cols-[58px_1fr] gap-3 text-left">
              <div className="relative pt-3 text-right">
                <div className="text-sm font-black text-[#123333]">{stop.time}</div>
                {idx < routeStops.length - 1 && <div className="absolute right-2 top-9 h-20 w-px bg-[#d8c9b2]" />}
                <div className="absolute right-0 top-8 h-4 w-4 rounded-full border-2 border-white bg-[#064b4a] shadow" />
              </div>
              <div className="rounded-3xl border border-[#e7dcc9] bg-white p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <ArtThumb label={stop.icon} className="h-12 w-12 rounded-2xl text-base" />
                  <div className="flex-1">
                    <h3 className="font-black text-[#123333]">{stop.title}</h3>
                    <p className="mt-1 text-xs text-[#53656a]"><MapPin size={12} className="inline" /> {stop.loc}</p>
                    <p className="mt-1 text-xs text-[#8a7352]">{stop.mins ? `建議 ${stop.mins}｜${stop.tag}` : stop.tag}</p>
                  </div>
                  <ChevronRight size={18} className="text-[#b68a3a]" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </main>
    </AppFrame>
  );
}

function FloorMapScreen({ back }) {
  const [floor, setFloor] = useState("1F");
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [lastDistance, setLastDistance] = useState(null);

  // 請把故宮官網下載的平面圖放到 public 資料夾：
  // public/npm-floor-1f.png、public/npm-floor-2f.png、public/npm-floor-3f.png、public/npm-floor-b1.png
  const floorImages = {
    "1F": "/npm-floor-1f.png",
    "2F": "/npm-floor-2f.png",
    "3F": "/npm-floor-3f.png",
    "B1": "/npm-floor-b1.png",
  };

  const getTouchDistance = (touches) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = (event) => {
    if (event.touches.length === 2) {
      setLastDistance(getTouchDistance(event.touches));
    }
  };

  const handleTouchMove = (event) => {
    if (event.touches.length === 2 && lastDistance) {
      event.preventDefault();
      const nextDistance = getTouchDistance(event.touches);
      const ratio = nextDistance / lastDistance;
      setScale((prev) => Math.min(4, Math.max(1, prev * ratio)));
      setLastDistance(nextDistance);
    }
  };

  const closeZoom = () => {
    setIsZoomOpen(false);
    setScale(1);
    setLastDistance(null);
  };

  return (
    <AppFrame>
      <Header title="展區平面圖" onBack={back} right={<MapPin size={20} />} />
      <main className="px-5 pt-4">
        <div className="grid grid-cols-4 rounded-2xl bg-[#f3eadb] p-1 text-center text-sm font-bold text-[#8a7352]">
          {Object.keys(floorImages).map((f) => (
            <button key={f} onClick={() => setFloor(f)} className={cn("rounded-xl py-2", floor === f ? "bg-[#064b4a] text-white" : "")}>{f}</button>
          ))}
        </div>

        <button onClick={() => setIsZoomOpen(true)} className="mt-4 block w-full overflow-hidden rounded-3xl border border-[#e7dcc9] bg-white shadow-sm">
          <img
            src={floorImages[floor]}
            alt={`故宮 ${floor} 展區平面圖`}
            className="h-[440px] w-full object-contain"
            onError={(event) => {
              event.currentTarget.style.display = "none";
              event.currentTarget.nextElementSibling.style.display = "flex";
            }}
          />
          <div className="hidden h-[440px] flex-col items-center justify-center gap-3 p-6 text-center text-sm leading-6 text-[#53656a]">
            <Map className="text-[#064b4a]" size={36} />
            <b className="text-[#123333]">尚未放入平面圖圖片</b>
            <span>請將官網下載的圖片放到 public 資料夾，檔名設為 npm-floor-1f.png。</span>
          </div>
        </button>

        <div className="mt-4 rounded-2xl border border-[#e7dcc9] bg-white p-4 text-sm leading-6 text-[#53656a] shadow-sm">
          <b className="text-[#123333]">使用方式</b><br />點一下平面圖會開啟放大檢視，可用雙指縮放查看細節。
        </div>
      </main>

      {isZoomOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/85 p-4 text-white">
          <div className="flex items-center justify-between pb-3 pt-2">
            <button onClick={closeZoom} className="rounded-full bg-white/15 px-4 py-2 font-bold">關閉</button>
            <div className="text-sm font-bold">{floor} 展區平面圖</div>
            <div className="flex gap-2">
              <button onClick={() => setScale((v) => Math.max(1, v - 0.25))} className="h-9 w-9 rounded-full bg-white/15 font-black">−</button>
              <button onClick={() => setScale((v) => Math.min(4, v + 0.25))} className="h-9 w-9 rounded-full bg-white/15 font-black">＋</button>
            </div>
          </div>
          <div
            className="flex flex-1 items-center overflow-auto rounded-2xl bg-white/10 p-2"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onWheel={(event) => {
              event.preventDefault();
              setScale((v) => Math.min(4, Math.max(1, v + (event.deltaY < 0 ? 0.15 : -0.15))));
            }}
            style={{ touchAction: "none" }}
          >
            <img
              src={floorImages[floor]}
              alt={`故宮 ${floor} 展區平面圖放大檢視`}
              className="mx-auto max-w-none rounded-xl bg-white"
              style={{ width: `${100 * scale}%` }}
            />
          </div>
          <p className="py-3 text-center text-xs text-white/70">雙指縮放，拖曳畫面可查看橫向平面圖細節。</p>
        </div>
      )}
    </AppFrame>
  );
}

const guideHalls = [
  {
    hall: "青銅器廳",
    location: "第一展覽館 1F 101",
    nextHall: "書畫廳",
    intro: "從禮器、銘文到權力象徵，理解青銅器如何承載古代社會秩序。",
    exhibits: [
      { title: "毛公鼎", time: "03:20", tag: "銘文重點", desc: "西周晚期重要青銅器，內壁長篇銘文記錄冊命內容，是理解西周政治制度的重要作品。", icon: "鼎" },
      { title: "散氏盤", time: "02:45", tag: "土地契約", desc: "以銘文記錄土地轉讓與盟誓，像是一份刻在青銅上的古代文件。", icon: "盤" },
      { title: "宗周鐘", time: "02:15", tag: "聲音與禮樂", desc: "青銅鐘不只是樂器，也是禮制與權力的象徵，反映古代聲音文化。", icon: "鐘" },
    ],
  },
  {
    hall: "書畫廳",
    location: "第一展覽館 1F 103-104",
    nextHall: "明星文物區",
    intro: "透過筆墨、構圖與觀看距離，進入古人的山水想像與心境。",
    exhibits: [
      { title: "溪山行旅圖", time: "04:10", tag: "山水經典", desc: "以高聳主山與細密皴法表現自然的壯闊，觀看時可先遠看氣勢，再近看筆觸。", icon: "山" },
      { title: "早春圖", time: "03:30", tag: "空間層次", desc: "畫面以雲氣與山勢層層推進，呈現春天甦醒時的山林氣息。", icon: "春" },
      { title: "快雪時晴帖", time: "02:50", tag: "書法欣賞", desc: "從字形節奏與行氣感受書法中的速度、情緒與留白。", icon: "帖" },
    ],
  },
  {
    hall: "明星文物區",
    location: "第一展覽館 1F 105",
    nextHall: "近代藝術廳",
    intro: "聚焦故宮人氣作品，用較短時間掌握最容易被記住的文物故事。",
    exhibits: [
      { title: "翠玉白菜", time: "03:18", tag: "人氣國寶", desc: "以翠玉天然色澤雕成白菜，葉脈、昆蟲與層次細節讓作品兼具寓意與工藝巧思。", icon: "玉" },
      { title: "肉形石", time: "02:40", tag: "材質想像", desc: "透過石材天然紋理與染色加工，讓礦物看起來像真實肉塊。", icon: "肉" },
      { title: "橄欖核舟", time: "03:05", tag: "微雕工藝", desc: "在極小材料上雕刻人物與船艙，展現精密工藝與觀看尺度的驚喜。", icon: "舟" },
    ],
  },
  {
    hall: "近代藝術廳",
    location: "第一展覽館 1F 106",
    nextHall: "行程結束",
    intro: "用當代視角回看傳統，整理本次觀看經驗與個人偏好。",
    exhibits: [
      { title: "院藏珍玩選件", time: "02:30", tag: "材質觀察", desc: "從玉、木、瓷等材質觀察工藝與生活美學的連結。", icon: "珍" },
      { title: "宮廷日常風景", time: "02:20", tag: "生活想像", desc: "透過器物想像清代宮廷生活中的禮儀、娛樂與日常秩序。", icon: "宮" },
      { title: "展後回顧", time: "01:30", tag: "整理心得", desc: "回顧今天最有印象的作品，作為下一次參觀推薦的依據。", icon: "記" },
    ],
  },
];

function durationToSeconds(duration) {
  const [minutes = "0", seconds = "0"] = duration.split(":");
  return Number(minutes) * 60 + Number(seconds);
}

function secondsToTime(totalSeconds) {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const minutes = String(Math.floor(safeSeconds / 60)).padStart(2, "0");
  const seconds = String(safeSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function GuideScreen({ go, back }) {
  const [playing, setPlaying] = useState(true);
  const [hallIndex, setHallIndex] = useState(0);
  const [exhibitIndex, setExhibitIndex] = useState(0);
  const [progress, setProgress] = useState(48);
  const [speedIndex, setSpeedIndex] = useState(0);

  const speeds = ["0.75x", "1.0x", "1.25x", "1.5x", "2.0x"];
  const currentHall = guideHalls[hallIndex];
  const currentExhibit = currentHall.exhibits[exhibitIndex];
  const duration = durationToSeconds(currentExhibit.time);
  const isLastHall = hallIndex === guideHalls.length - 1;
  const progressPercent = Math.min(100, Math.max(0, (progress / duration) * 100));

  useEffect(() => {
    setProgress(0);
    setPlaying(true);
  }, [hallIndex, exhibitIndex]);

  const seek = (nextProgress) => {
    setProgress(Math.min(duration, Math.max(0, nextProgress)));
  };

  const goNextExhibit = () => {
    if (exhibitIndex < currentHall.exhibits.length - 1) {
      setExhibitIndex(exhibitIndex + 1);
      return;
    }
    if (!isLastHall) {
      setHallIndex(hallIndex + 1);
      setExhibitIndex(0);
      return;
    }
    go("report");
  };

  const goNextHall = () => {
    if (isLastHall) {
      go("report");
      return;
    }
    setHallIndex(hallIndex + 1);
    setExhibitIndex(0);
  };

  return (
    <AppFrame>
      <Header
        title="館內導覽"
        subtitle={`${currentHall.location}｜${currentHall.hall}`}
        onBack={back}
        right={<button onClick={() => go("map")} className="rounded-full bg-[#064b4a] px-3 py-1 text-xs font-bold text-white">平面圖</button>}
      />
      <main className="h-[calc(100svh-74px)] overflow-y-auto px-5 pb-8 pt-5 sm:h-[826px]">
        <div className="rounded-3xl border border-[#e7dcc9] bg-[#f3eadb] p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-[#8a7352]">目前展廳 {hallIndex + 1}/{guideHalls.length}</p>
              <h2 className="mt-1 text-2xl font-black text-[#123333]">{currentHall.hall}</h2>
              <p className="mt-1 flex items-center gap-1 text-xs font-bold text-[#064b4a]"><MapPin size={13} /> {currentHall.location}</p>
            </div>
            <button onClick={goNextHall} className="shrink-0 rounded-full bg-white px-3 py-2 text-xs font-black text-[#064b4a] shadow-sm">
              {isLastHall ? "完成行程" : "下個展廳"}
            </button>
          </div>
          <p className="mt-3 text-sm leading-6 text-[#53656a]">{currentHall.intro}</p>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-[#8a7352]">正在播放 {exhibitIndex + 1}/{currentHall.exhibits.length}</p>
            <h3 className="mt-1 text-xl font-black text-[#123333]">{currentExhibit.title}</h3>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-[#064b4a]">{currentExhibit.tag}</span>
        </div>

        <ArtThumb label={currentExhibit.icon} className="mt-4 h-56 w-full bg-gradient-to-br from-[#edf4ee] via-[#d6e5dc] to-[#7aa995] text-6xl text-[#064b4a]" />
        <p className="mt-4 text-sm leading-7 text-[#53656a]">{currentExhibit.desc}</p>

        <div className="mt-4 rounded-3xl border border-[#e7dcc9] bg-white p-4 shadow-sm">
          <div className="relative h-7">
            <div className="absolute left-0 right-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-[#e7dcc9]" />
            <div className="absolute left-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-[#064b4a]" style={{ width: `${progressPercent}%` }} />
            <input
              type="range"
              min="0"
              max={duration}
              value={progress}
              onChange={(event) => seek(Number(event.target.value))}
              className="absolute inset-0 h-7 w-full cursor-pointer opacity-0"
              aria-label="導覽播放進度"
            />
          </div>
          <div className="mt-1 flex justify-between text-xs text-[#8a7352]"><span>{secondsToTime(progress)}</span><span>{currentExhibit.time}</span></div>
          <div className="mt-4 flex items-center justify-center gap-6">
            <button onClick={() => seek(progress - 15)} className="rounded-full p-2 text-[#53656a] active:bg-[#f3eadb]" aria-label="倒退 15 秒">
              <RotateCcw size={23} />
            </button>
            <button onClick={() => setPlaying(!playing)} className="flex h-16 w-16 items-center justify-center rounded-full bg-[#064b4a] text-white shadow-lg shadow-[#064b4a]/25" aria-label={playing ? "暫停" : "播放"}>
              {playing ? <Pause size={28} fill="white" /> : <Play size={28} fill="white" />}
            </button>
            <button onClick={() => seek(progress + 15)} className="rounded-full p-2 text-[#53656a] active:bg-[#f3eadb]" aria-label="快轉 15 秒">
              <RotateCw size={23} />
            </button>
            <button onClick={() => setSpeedIndex((speedIndex + 1) % speeds.length)} className="rounded-full border border-[#e7dcc9] px-3 py-1 text-sm font-bold text-[#53656a] active:bg-[#f3eadb]">
              {speeds[speedIndex]}
            </button>
          </div>
          <button onClick={goNextExhibit} className="mt-4 h-12 w-full rounded-2xl bg-[#064b4a] font-black text-white">
            {exhibitIndex < currentHall.exhibits.length - 1 ? "播放下一件展品" : isLastHall ? "完成導覽並查看報告" : `進入下個展廳：${currentHall.nextHall}`}
          </button>
        </div>

        <div className="mt-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-black text-[#123333]">本展廳導覽展品</h3>
            <span className="text-xs text-[#8a7352]">可手動切換播放</span>
          </div>
          <div className="space-y-3">
            {currentHall.exhibits.map((item, index) => (
              <button
                key={item.title}
                onClick={() => {
                  setExhibitIndex(index);
                  setPlaying(true);
                }}
                className={cn(
                  "flex w-full items-center gap-3 rounded-2xl border p-3 text-left shadow-sm",
                  index === exhibitIndex ? "border-[#064b4a] bg-[#064b4a] text-white" : "border-[#e7dcc9] bg-white text-[#123333]"
                )}
              >
                <ArtThumb label={item.icon} className={cn("h-12 w-12 shrink-0 rounded-xl text-base", index === exhibitIndex ? "border-white/30 bg-white/15 text-white" : "")} />
                <div className="flex-1">
                  <div className="font-black">{index + 1}. {item.title}</div>
                  <div className={cn("mt-1 text-xs", index === exhibitIndex ? "text-white/75" : "text-[#8a7352]")}>{item.tag}｜{item.time}</div>
                </div>
                {index === exhibitIndex ? <Pause size={18} /> : <Play size={18} />}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button onClick={() => go("map")} className="h-12 rounded-2xl border border-[#064b4a] bg-white font-black text-[#064b4a]">查看平面圖</button>
          <button onClick={goNextHall} className="h-12 rounded-2xl bg-[#123333] font-black text-white">
            {isLastHall ? "結束導覽" : "前往下個展廳"}
          </button>
        </div>
      </main>
    </AppFrame>
  );
}

function AdjustScreen({ go, back }) {
  const options = [
    ["保留，後面壓縮", "維持原路線，縮短後續停留時間"],
    ["跳過一區", "跳過下一個展區以維持時程"],
    ["延後到下次", "留下喜歡的展區，以後再看"],
    ["不調整，我今天想慢慢看", "維持原計畫，享受慢遊時光"],
  ];
  return (
    <AppFrame>
      <div className="relative min-h-[100svh] bg-[#123333]/15 sm:min-h-[900px]">
        <Header title="動態調整建議" onBack={back} right={<X size={20} onClick={back} />} />
        <div className="absolute inset-x-5 top-36 rounded-[32px] border border-[#e7dcc9] bg-[#fffdf8] p-5 shadow-2xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-3xl font-black text-amber-600">!</div>
          <h2 className="mt-3 text-center text-xl font-black text-[#123333]">你多停留了一會兒</h2>
          <p className="mt-3 text-center text-sm leading-6 text-[#53656a]">你在「翠玉白菜」停留時間比預計多了 8 分鐘，是否需要調整後續行程？</p>
          <div className="mt-5 space-y-3">
            {options.map(([title, desc], idx) => (
              <button key={title} onClick={() => go(idx === 0 ? "route" : "report")} className={cn("w-full rounded-2xl border p-4 text-left", idx === 0 ? "border-[#064b4a] bg-[#064b4a] text-white" : "border-[#e7dcc9] bg-white text-[#123333]")}> 
                <div className="font-black">{title}</div>
                <div className={cn("mt-1 text-xs", idx === 0 ? "text-white/75" : "text-[#8a7352]")}>{desc}</div>
              </button>
            ))}
          </div>
          <label className="mt-5 flex items-center justify-center gap-2 text-sm text-[#8a7352]"><input type="checkbox" /> 下次不再提醒</label>
        </div>
      </div>
    </AppFrame>
  );
}

function ReportScreen({ go, back }) {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const shareItems = [
    ["儲存照片", "🖼️"],
    ["分享到 Facebook", "f"],
    ["分享到 Instagram", "◎"],
    ["複製連結", "🔗"],
  ];

  return (
    <AppFrame>
      <Header title="我的故宮探索報告" subtitle="本次行程：90 分鐘" onBack={back} right={<button onClick={() => setIsShareOpen(true)} className="rounded-full bg-[#f3eadb] p-2 text-[#064b4a]"><Share2 size={18} /></button>} />
      <main className="px-5 pt-4">
        <div className="grid grid-cols-[1.05fr_.95fr] gap-3">
          <div className="rounded-3xl border border-[#e7dcc9] bg-white p-4 shadow-sm">
            <h3 className="text-sm font-black text-[#123333]">最多瀏覽 TOP 5</h3>
            <div className="mt-3 space-y-2">
              {[["翠玉白菜", "18"], ["毛公鼎", "16"], ["溪山行旅圖", "14"], ["散氏盤", "12"], ["帝國邊界", "10"]].map(([name, mins], i) => <div key={name} className="flex items-center justify-between text-xs"><span><b className="mr-2 text-[#b68a3a]">{i + 1}</b>{name}</span><span>{mins} 分鐘</span></div>)}
            </div>
          </div>
          <div className="rounded-3xl border border-[#e7dcc9] bg-white p-4 text-center shadow-sm">
            <h3 className="text-sm font-black text-[#123333]">偏好分析</h3>
            <div className="mx-auto mt-4 h-28 w-28 rounded-full bg-[conic-gradient(#064b4a_0_45%,#89aaa2_45%_75%,#d9c18b_75%_90%,#eadcc5_90%_100%)] p-5"><div className="h-full w-full rounded-full bg-white" /></div>
            <p className="mt-2 text-xs text-[#53656a]">文物 45%・書畫 30%</p>
          </div>
        </div>
        <div className="mt-4 rounded-3xl border border-[#e7dcc9] bg-white p-4 shadow-sm">
          <h3 className="font-black text-[#123333]">你的參觀風格</h3>
          <div className="mt-2 rounded-2xl bg-emerald-50 p-4 text-center">
            <Trophy className="mx-auto text-[#b68a3a]" />
            <div className="mt-1 text-xl font-black text-[#064b4a]">深度探索型</div>
            <p className="mt-1 text-xs text-[#53656a]">專注細節，重視文化內涵</p>
          </div>
        </div>
        <div className="mt-4 rounded-3xl border border-[#e7dcc9] bg-white p-4 shadow-sm">
          <h3 className="font-black text-[#123333]">下次推薦給你</h3>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs text-[#064b4a]">
            {['唐代書畫特展', '瓷器專題展', '佛教藝術廳'].map(x => <span key={x} className="rounded-2xl bg-[#f3eadb] px-2 py-3">{x}</span>)}
          </div>
        </div>
        <button onClick={() => go("home")} className="mt-5 h-14 w-full rounded-2xl bg-[#064b4a] text-base font-black text-white shadow-lg shadow-[#064b4a]/20">加入我的下次行程</button>
      </main>

      {isShareOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/55" onClick={() => setIsShareOpen(false)}>
          <div className="w-full max-w-[430px] rounded-t-[32px] bg-[#fffdf8] p-5 pb-8 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-[#d8c9b2]" />
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-black text-[#123333]">分享探索報告</h3>
              
            </div>
            <div className="grid grid-cols-2 gap-3">
              {shareItems.map(([label, icon]) => (
                <button key={label} className="rounded-2xl border border-[#e7dcc9] bg-white p-4 text-left shadow-sm">
                  <div className="text-2xl font-black text-[#064b4a]">{icon}</div>
                  <div className="mt-2 text-sm font-black text-[#123333]">{label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </AppFrame>
  );
}

function AppScreen({ screen, go, back, addFavorite, favorites, selectedExhibition, openExhibition }) {
  switch (screen) {
    case "splash": return <Splash go={go} />;
    case "home": return <HomeScreen go={go} openExhibition={openExhibition} />;
    case "halls": return <HallsScreen go={go} back={back} openExhibition={openExhibition} />;
    case "exhibition": return <ExhibitionScreen go={go} back={back} addFavorite={addFavorite} favorites={favorites} exhibition={selectedExhibition} />;
    case "planning": return <PlanningScreen go={go} back={back} favorites={favorites} />;
    case "route": return <RouteScreen go={go} back={back} />;
    case "map": return <FloorMapScreen back={back} />;
    case "guide": return <GuideScreen go={go} back={back} />;
    case "adjust": return <AdjustScreen go={go} back={back} />;
    case "report": return <ReportScreen go={go} back={back} />;
    default: return <HomeScreen go={go} />;
  }
}

export default function NpmGuideAppPrototype() {
  const [screen, setScreen] = useState("splash");
  const [history, setHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [selectedExhibition, setSelectedExhibition] = useState(halls[0]);
  const [toast, setToast] = useState("");
  const [previousScreen, setPreviousScreen] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 1800);
    return () => clearTimeout(timer);
  }, [toast]);

  const addFavorite = (item) => {
    setFavorites((prev) => {
      if (prev.some((favorite) => favorite.id === item.id)) return prev;
      return [...prev, item];
    });
    setToast("已加入我的最愛");
  };

  const changeScreen = (target) => {
    setPreviousScreen(screen);
    setScreen(target);
    setIsTransitioning(true);
    window.setTimeout(() => {
      setPreviousScreen(null);
      setIsTransitioning(false);
    }, 320);
  };

  const go = (target, replace = false) => {
    if (!screens.includes(target)) return;
    if (replace) {
      changeScreen(target);
      return;
    }
    setHistory((prev) => [...prev, screen]);
    changeScreen(target);
  };

  const openExhibition = (item) => {
    setSelectedExhibition(item);
    go("exhibition");
  };

  const back = () => {
    setHistory((prev) => {
      if (prev.length === 0) {
        changeScreen("home");
        return prev;
      }
      const next = [...prev];
      const target = next.pop();
      changeScreen(target);
      return next;
    });
  };

  return (
    <>
      <div className="relative min-h-[100svh] overflow-hidden bg-[#efe6d7]">
        {previousScreen && isTransitioning && (
          <div className="pointer-events-none absolute inset-0 z-10 animate-[pageOut_0.32s_ease_forwards]">
            <AppScreen
              screen={previousScreen}
              go={go}
              back={back}
              addFavorite={addFavorite}
              favorites={favorites}
              selectedExhibition={selectedExhibition}
              openExhibition={openExhibition}
            />
          </div>
        )}

        <div key={screen} className={isTransitioning ? "animate-[pageIn_0.32s_ease_forwards]" : ""}>
          <AppScreen
            screen={screen}
            go={go}
            back={back}
            addFavorite={addFavorite}
            favorites={favorites}
            selectedExhibition={selectedExhibition}
            openExhibition={openExhibition}
          />
        </div>

        <style>{`
          @keyframes pageIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes pageOut {
            from { opacity: 1; }
            to { opacity: 0; }
          }
        `}</style>
      </div>

      {toast && (
        <div className="fixed left-1/2 top-6 z-[60] -translate-x-1/2 rounded-full bg-[#064b4a] px-5 py-3 text-sm font-black text-white shadow-2xl">
          {toast}
        </div>
      )}
    </>
  );
}
