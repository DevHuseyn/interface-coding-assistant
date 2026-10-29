import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  File, FolderOpen, Save, Upload, Box, Image, Layers, Globe, Maximize, ArrowUpFromLine,
  MousePointer2, Hexagon, Square, Circle, Brush, Ruler, Diamond, MoveVertical, Scissors,
  LineChart, Camera, Search, Settings, User, ChevronDown, ChevronRight, X, Hand, RotateCw,
  ZoomIn, ZoomOut, Folder, FileText, Move, Expand, MapPin, Triangle, Hash, Minus, Copy,
} from "lucide-react";
import cloud from "@/assets/pointcloud.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OpenLiDAR AI – Geospatial Studio" },
      { name: "description", content: "Point cloud viewer and LiDAR classification studio." },
      { property: "og:title", content: "OpenLiDAR AI – Geospatial Studio" },
      { property: "og:description", content: "Point cloud viewer and LiDAR classification studio." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Studio,
});

const menus = ["Home", "Viewer", "Classification", "Terrain", "Extraction", "Registration", "Tools", "Export", "Help"];
type T = { i: typeof File; l: string };
const ribbon: T[][] = [
  [{ i: File, l: "New" }, { i: FolderOpen, l: "Open" }, { i: Save, l: "Save" }],
  [{ i: Upload, l: "Import" }],
  [{ i: Box, l: "LAS/LAZ" }, { i: Box, l: "E57" }, { i: Box, l: "PLY" }, { i: Box, l: "XYZ" }, { i: Image, l: "Images" }],
  [{ i: Layers, l: "Add Layer" }, { i: Globe, l: "Coord. System" }],
  [{ i: Maximize, l: "View Fit" }],
  [{ i: ArrowUpFromLine, l: "Top" }, { i: Box, l: "Front" }, { i: Box, l: "Right" }],
  [{ i: MousePointer2, l: "Select" }, { i: Hexagon, l: "Polygon" }, { i: Square, l: "Rectangle" }, { i: Circle, l: "Circle" }, { i: Brush, l: "Brush" }],
  [{ i: Ruler, l: "Distance" }, { i: Diamond, l: "Area" }, { i: MoveVertical, l: "Height" }],
  [{ i: Scissors, l: "Clipping Box" }, { i: LineChart, l: "Cross Section" }],
  [{ i: Camera, l: "Screenshot" }],
];

type Node = { n: string; c?: Node[]; folder?: boolean; check?: boolean; dot?: string };
const tree: Node = {
  n: "City_Project", check: true, folder: true, c: [
    { n: "Data", folder: true, c: [
      { n: "Point Clouds", check: true, folder: true, c: [{ n: "city_area.laz", check: true, dot: "bg-cls-building" }] },
      { n: "Scans", folder: true, c: [{ n: "scan_01.laz" }, { n: "scan_02.laz" }, { n: "scan_03.laz" }] },
      { n: "Imagery", folder: true, c: [{ n: "orthophoto.tif" }] },
      { n: "Surfaces", folder: true, c: [{ n: "DTM.tif" }, { n: "DSM.tif" }] },
      { n: "Vectors", folder: true, c: [{ n: "building_footprints.shp" }] },
    ] },
    { n: "Results", folder: true, c: [
      { n: "Classification", folder: true, c: [
        { n: "ground.laz", check: true, dot: "bg-cls-ground" }, { n: "buildings.laz", check: true, dot: "bg-cls-building" },
        { n: "vegetation.laz", check: true, dot: "bg-cls-vegetation" }, { n: "unclassified.laz", check: true, dot: "bg-cls-unclassified" },
      ] },
      { n: "Models", folder: true, c: [{ n: "contours.shp" }, { n: "volume_area.shp" }] },
    ] },
  ],
};

function TreeItem({ node, depth }: { node: Node; depth: number }) {
  const [open, setOpen] = useState(true);
  const [sel, setSel] = useState(node.check);
  const active = node.n === "city_area.laz";
  return (
    <div>
      <div className={`flex items-center gap-1.5 rounded px-1 py-[3px] ${active ? "bg-accent" : "hover:bg-muted"}`} style={{ paddingLeft: depth * 16 + 4 }}>
        {node.c ? (
          <button onClick={() => setOpen(!open)}>{open ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}</button>
        ) : <span className="w-3.5" />}
        {node.check !== undefined && <input type="checkbox" checked={!!sel} onChange={() => setSel(!sel)} className="size-3.5 accent-primary" />}
        {node.dot ? <span className={`size-3 rounded-full ${node.dot}`} /> : node.folder ? <Folder className="size-3.5 text-cls-ground" /> : <FileText className="size-3.5 text-primary" />}
        <span>{node.n}</span>
      </div>
      {open && node.c?.map((ch) => <TreeItem key={ch.n} node={ch} depth={depth + 1} />)}
    </div>
  );
}

function Panel({ title, children, className = "", right }: { title: string; children: React.ReactNode; className?: string; right?: React.ReactNode }) {
  return (
    <section className={`flex min-h-0 flex-col rounded-md border bg-card ${className}`}>
      <header className="flex items-center justify-between border-b px-3 py-2 font-semibold">
        <span className="flex items-center gap-2"><Layers className="size-3.5 text-primary" />{title}</span>
        {right ?? <X className="size-3.5 text-muted-foreground" />}
      </header>
      <div className="min-h-0 flex-1 overflow-auto">{children}</div>
    </section>
  );
}

function Tabs({ items, active, onChange }: { items: string[]; active: string; onChange: (s: string) => void }) {
  return (
    <div className="flex border-b">
      {items.map((t) => (
        <button key={t} onClick={() => onChange(t)} className={`px-4 py-2 ${active === t ? "border-b-2 border-primary font-semibold text-primary" : "text-foreground hover:bg-muted"}`}>{t}</button>
      ))}
    </div>
  );
}

const classes = [
  { id: 0, n: "Unclassified", c: "1,245,320", p: "10.0%", s: "bg-cls-unclassified" },
  { id: 2, n: "Ground", c: "5,123,450", p: "41.1%", s: "bg-cls-ground" },
  { id: 5, n: "Vegetation", c: "3,456,780", p: "27.7%", s: "bg-cls-vegetation" },
  { id: 6, n: "Building", c: "1,987,320", p: "15.9%", s: "bg-cls-building" },
  { id: 9, n: "Water", c: "345,210", p: "2.8%", s: "bg-cls-water" },
  { id: "", n: "Others", c: "298,240", p: "2.5%", s: "bg-cls-unclassified" },
];
const props = [
  ["File Name", "city_area.laz"], ["Points", "12,458,320"], ["File Size", "1.24 GB"], ["Coordinate System", "EPSG:4326 (WGS 84)"],
  ["Min X", "49.820123"], ["Max X", "49.845672"], ["Min Y", "40.365210"], ["Max Y", "40.382115"], ["Min Z", "-12.45"], ["Max Z", "187.36"],
];

function Profile() {
  const pts = Array.from({ length: 900 }, (_, i) => {
    const x = (i * 7.31) % 560;
    const b = ([[50, 80, 120], [230, 280, 160], [330, 360, 175], [420, 450, 140]] as [number, number, number][]).find(([a, e]) => x > a && x < e);
    const base = 20 + Math.sin(x / 30) * 8 + ((i * 13) % 17);
    const y = b ? ((i * 37) % b[2]) : base + ((i * 7) % 25);
    return { x, y };
  });
  const color = (y: number) => `oklch(${0.55 + y / 600} 0.2 ${260 - y * 1.3})`;
  return (
    <svg viewBox="0 0 600 230" className="h-full w-full">
      {[0, 50, 100, 150, 200].map((v) => (
        <g key={v}><text x="20" y={205 - v * 0.9} fontSize="10" textAnchor="end" className="fill-muted-foreground">{v}</text></g>
      ))}
      {[0, 100, 200, 300, 400, 500].map((v) => <text key={v} x={30 + v} y="222" fontSize="10" textAnchor="middle" className="fill-muted-foreground">{v}</text>)}
      <line x1="28" y1="205" x2="590" y2="205" className="stroke-border" />
      {pts.map((p, i) => <circle key={i} cx={30 + p.x} cy={205 - p.y * 0.9} r="1.6" fill={color(p.y)} />)}
    </svg>
  );
}

function Studio() {
  const [menu, setMenu] = useState("Home");
  const [view, setView] = useState("3D View");
  const [rt, setRt] = useState("Properties");
  const [tt, setTt] = useState("Measurement");
  const [tool, setTool] = useState("Select");
  const [vt, setVt] = useState(0);
  const layers: [string, number | null][] = [["Point Cloud", 100], ["Ground", null], ["Buildings", null], ["Vegetation", null], ["Unclassified", null], ["Images", 80], ["Surface (DTM)", 70], ["Contours", 100], ["Vectors", 100]];

  return (
    <div className="flex h-screen min-w-[1200px] flex-col bg-background text-xs text-foreground">
      <div className="flex items-center justify-between bg-card px-3 py-1.5">
        <div className="flex items-center gap-2 text-sm font-semibold"><span className="grid size-5 place-items-center rounded-full bg-primary text-[10px] text-primary-foreground">O</span>OpenLiDAR AI – Ultimate Geospatial Studio</div>
        <div className="flex items-center gap-4">
          <label className="flex w-56 items-center gap-2 rounded border bg-muted px-2 py-1 text-muted-foreground"><Search className="size-3.5" /><input placeholder="Search tools or commands..." className="w-full bg-transparent outline-none" /></label>
          <Minus className="size-4" /><Copy className="size-3.5" /><X className="size-4" />
        </div>
      </div>
      <div className="flex items-center justify-between border-b bg-card px-2">
        <div className="flex">
          <button className="my-1 rounded bg-primary px-4 py-1.5 text-primary-foreground">Project</button>
          {menus.map((m) => <button key={m} onClick={() => setMenu(m)} className={`px-4 py-2 ${menu === m ? "rounded-t border border-b-0 bg-background" : "hover:bg-muted"}`}>{m}</button>)}
        </div>
        <div className="flex gap-4 pr-2"><Settings className="size-4" /><User className="size-4" /></div>
      </div>
      <div className="flex items-stretch gap-1 overflow-x-auto border-b bg-card px-2 py-2">
        {ribbon.map((g, gi) => (
          <div key={gi} className="flex border-r pr-1 last:border-0">
            {g.map(({ i: I, l }) => (
              <button key={l} onClick={() => setTool(l)} className={`flex w-16 flex-col items-center gap-1 rounded py-1 ${tool === l ? "bg-accent text-accent-foreground" : "hover:bg-muted"}`}>
                <I className="size-6 stroke-[1.4]" /><span className="text-center leading-tight">{l}</span>
              </button>
            ))}
          </div>
        ))}
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-[260px_1fr_340px] grid-rows-[1fr_250px] gap-2 p-2">
        <Panel title="Project"><div className="p-1"><TreeItem node={tree} depth={0} /></div></Panel>

        <section className="flex min-h-0 flex-col rounded-md border bg-card">
          <Tabs items={["3D View", "2D Map", "Profile View", "Cross Section"]} active={view} onChange={setView} />
          <div className="relative min-h-0 flex-1 overflow-hidden bg-viewport">
            <img src={cloud} alt="City point cloud" width={1600} height={1008} className="h-full w-full object-cover" />
            <div className="absolute left-2 top-2 flex flex-col gap-1 rounded-md bg-card p-1 shadow">
              {[MousePointer2, Hand, RotateCw, ZoomIn, Box, Box].map((I, i) => (
                <button key={i} onClick={() => setVt(i)} className={`grid size-8 place-items-center rounded ${vt === i ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}><I className="size-4" /></button>
              ))}
            </div>
          </div>
        </section>

        <section className="row-span-1 flex min-h-0 flex-col rounded-md border bg-card">
          <Tabs items={["Properties", "Classification", "Processing"]} active={rt} onChange={setRt} />
          <div className="min-h-0 flex-1 overflow-auto p-2">
            <div className="mb-1 flex items-center gap-1 font-semibold"><ChevronDown className="size-3.5" />Point Cloud: city_area.laz</div>
            <table className="mb-3 w-full border">
              <tbody>{props.map(([k, v]) => <tr key={k} className="border-b"><td className="px-3 py-1 text-muted-foreground">{k}</td><td className="px-3 py-1">{v}</td></tr>)}</tbody>
            </table>
            <div className="mb-2 font-semibold">Classification</div>
            <div className="mb-2 flex items-center gap-3">Show by: <select className="flex-1 rounded border bg-card px-2 py-1"><option>Classification</option><option>Elevation</option><option>Intensity</option></select></div>
            {classes.map((c) => (
              <div key={c.n} className="grid grid-cols-[20px_24px_1fr_auto_50px] items-center gap-2 py-1">
                <span className={`size-3.5 rounded-sm ${c.s}`} /><span>{c.id}</span><span>{c.n}</span><span>{c.c}</span><span className="text-right text-muted-foreground">{c.p}</span>
              </div>
            ))}
          </div>
        </section>

        <Panel title="Layers">
          <div className="space-y-2 p-3">
            {layers.map(([n, v]) => (
              <label key={n} className={`flex items-center gap-2 ${v === null ? "pl-4" : ""}`}>
                <input type="checkbox" defaultChecked={n !== "Contours"} className="size-3.5 accent-primary" />
                <span className="flex-1">{n}</span>
                {v !== null && <><input type="range" defaultValue={v} className="w-20 accent-primary" /><span className="w-8 text-right text-muted-foreground">{v}%</span></>}
              </label>
            ))}
          </div>
        </Panel>

        <div className="grid min-h-0 grid-cols-2 gap-2">
          <Panel title="Profile View" right={<span className="flex gap-2 text-muted-foreground"><Move className="size-3.5" /><ZoomIn className="size-3.5" /><ZoomOut className="size-3.5" /><Expand className="size-3.5" /><X className="size-3.5" /></span>}>
            <div className="h-full p-2"><Profile /></div>
          </Panel>
          <Panel title="Attribute Table (city_area.laz)">
            <table className="w-full text-right">
              <thead className="sticky top-0 bg-muted"><tr>{["#", "X", "Y", "Z", "Class", "Intensity"].map((h) => <th key={h} className="px-2 py-1 font-medium">{h}</th>)}</tr></thead>
              <tbody>{Array.from({ length: 8 }, (_, i) => (
                <tr key={i} className="border-b"><td className="px-2 py-1">{i + 1}</td><td className="px-2">{(49.834521 + i * 0.000002).toFixed(6)}</td><td className="px-2">{(40.372115 + i * 0.000002).toFixed(6)}</td><td className="px-2">{(12.451 + (i % 3) * 0.008).toFixed(3)}</td><td className="px-2">2</td><td className="px-2">{45 + i}</td></tr>
              ))}</tbody>
            </table>
          </Panel>
        </div>

        <Panel title="Tools">
          <Tabs items={["Measurement", "Clipping", "Edit", "Analysis"]} active={tt} onChange={setTt} />
          <div className="grid grid-cols-4 gap-2 p-3">
            {[[MapPin, "Point"], [Ruler, "Distance"], [Diamond, "Area"], [MoveVertical, "Height"], [Triangle, "Angle"], [LineChart, "Profile"], [Box, "Volume"], [Hash, "Count"]].map(([I, l]) => {
              const Ic = I as typeof File;
              return <button key={l as string} className="flex flex-col items-center gap-1 rounded py-2 hover:bg-accent"><Ic className="size-6 stroke-[1.4] text-primary" />{l as string}</button>;
            })}
          </div>
        </Panel>
      </div>

      <footer className="flex items-center justify-between border-t bg-card px-3 py-1.5 text-muted-foreground">
        <span>Ready</span>
        <span className="flex gap-4">Points: 12,458,320 <span>Selected: 0</span> <span>Coordinate System: EPSG:4326 (WGS 84)</span> <span>X: 49.836421</span> <span>Y: 40.371254</span> <span>Z: 15.632</span>
          <span className="h-2 w-16 self-center overflow-hidden rounded bg-muted"><span className="block h-full w-2/3 bg-primary" /></span></span>
      </footer>
    </div>
  );
}
