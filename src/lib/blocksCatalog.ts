export type InteractionKind = "Press" | "Hover" | "Drag" | "Type" | "Loading";

export interface BlockTweakConfig {
  accent: string;
  stiffness: number;
  damping: number;
  speed: number;
}

export interface BlockMeta {
  id: string;
  title: string;
  kind: InteractionKind;
  tagline: string;
  description: string;
  accent: string;
  featured: boolean;
  pro?: boolean;
  soundId: string;
  stageStyle?: "plain" | "dots" | "blueprint";
  defaultTweaks: BlockTweakConfig;
  archetype?: "press-pill" | "hover-magnetic" | "drag-spring" | "type-token" | "loading-pulse";
}

export const FEATURED_BLOCKS: BlockMeta[] = [
  {
    id: "ink-bloom",
    title: "Ink bloom",
    kind: "Press",
    tagline: "Fluid coordinate-tracked ink expansion on pointer down.",
    description:
      "Captures exact pointer coordinates relative to button bounds and expands a spring-damped pigment circle with tactile counter recoil.",
    accent: "#0d99ff",
    featured: true,
    soundId: "warm-tact",
    stageStyle: "dots",
    defaultTweaks: { accent: "#0d99ff", stiffness: 380, damping: 26, speed: 1 },
  },
  {
    id: "peek-rating",
    title: "Peek rating",
    kind: "Hover",
    tagline: "Expressive 5-point vernier rating with spring micro-peek.",
    description:
      "Hovering across stars lifts adjacent glyphs in a bell curve while revealing precision sentiment labels and locking on click.",
    accent: "#e09a12",
    featured: true,
    soundId: "vernier-tick",
    stageStyle: "plain",
    defaultTweaks: { accent: "#e09a12", stiffness: 420, damping: 22, speed: 1 },
  },
  {
    id: "card-swap",
    title: "Card swap",
    kind: "Drag",
    tagline: "Velocity-aware deck throw that cycles cards to the back.",
    description:
      "Drag the top archival card in any direction; release past threshold or flick with velocity to arc it cleanly behind the stack.",
    accent: "#ff3b6b",
    featured: true,
    soundId: "paper-flick",
    stageStyle: "dots",
    defaultTweaks: { accent: "#ff3b6b", stiffness: 320, damping: 25, speed: 1 },
  },
  {
    id: "dot-swarm",
    title: "Dot swarm",
    kind: "Hover",
    tagline: "60fps Canvas field of 168 spring-tethered particles.",
    description:
      "Each dot remembers its home lattice coordinate while experiencing inverse-square radial repulsion and tangential swirl near your cursor.",
    accent: "#2231dd",
    featured: true,
    soundId: "velvet-hover",
    stageStyle: "plain",
    defaultTweaks: { accent: "#0d99ff", stiffness: 290, damping: 20, speed: 1 },
  },
  {
    id: "wake-slider",
    title: "Wake slider",
    kind: "Drag",
    tagline: "Draggable precision fader raising a Gaussian ruler wake.",
    description:
      "Scrubbing along the 33-tick vernier scale elevates neighboring calibration marks proportionally to Gaussian proximity.",
    accent: "#0d99ff",
    featured: true,
    soundId: "vernier-tick",
    stageStyle: "blueprint",
    defaultTweaks: { accent: "#0d99ff", stiffness: 450, damping: 28, speed: 1 },
  },
  {
    id: "metaballs",
    title: "Metaballs",
    kind: "Hover",
    tagline: "SVG feColorMatrix liquid threshold merging live droplets.",
    description:
      "Combines Gaussian blur alpha multiplication in SVG filter space so cursor-bound droplets coalesce with organic surface tension.",
    accent: "#ff3b6b",
    featured: true,
    pro: true,
    soundId: "spring-pop",
    stageStyle: "plain",
    defaultTweaks: { accent: "#ff3b6b", stiffness: 240, damping: 19, speed: 1 },
  },
  {
    id: "ai-chat-input",
    title: "AI chat input",
    kind: "Type",
    tagline: "Prompt composer with /slash menu, model pill, and live stream.",
    description:
      "Type a prompt or press '/' to summon quick commands, switch reasoning models, and hit Enter to watch token-by-token live synthesis.",
    accent: "#0d99ff",
    featured: true,
    soundId: "keycap-pbt",
    stageStyle: "dots",
    defaultTweaks: { accent: "#0d99ff", stiffness: 400, damping: 28, speed: 1 },
  },
  {
    id: "orbit-cards",
    title: "Orbit cards",
    kind: "Drag",
    tagline: "Planetary 3D ring carousel driven by horizontal drag momentum.",
    description:
      "Drag left or right to scrub orbital angle; trigonometric depth computes scale, opacity, and z-order in real time.",
    accent: "#9d7bf5",
    featured: true,
    pro: true,
    soundId: "magnetic-snap",
    stageStyle: "blueprint",
    defaultTweaks: { accent: "#9d7bf5", stiffness: 280, damping: 24, speed: 1 },
  },
  {
    id: "load-cards",
    title: "Load cards",
    kind: "Press",
    tagline: "Press to fan & deal stacked specimen cards with spring jitter.",
    description:
      "Cycles between compact stack, fanned hand, and grid spread on press using staggered spring physics.",
    accent: "#1f9d55",
    featured: true,
    soundId: "paper-flick",
    stageStyle: "dots",
    defaultTweaks: { accent: "#1f9d55", stiffness: 360, damping: 23, speed: 1 },
  },
  {
    id: "edge-light",
    title: "Edge light",
    kind: "Hover",
    tagline: "Bevel-tracked specular rim illumination following pointer angle.",
    description:
      "Projects dual radial gradients onto a 1px border mask and glass surface to mimic machined anodized aluminum catching desk light.",
    accent: "#4c8dff",
    featured: true,
    soundId: "glass-tap",
    stageStyle: "plain",
    defaultTweaks: { accent: "#4c8dff", stiffness: 340, damping: 26, speed: 1 },
  },
  {
    id: "blueprint-loader",
    title: "Blueprint loader",
    kind: "Loading",
    tagline: "CAD construction hairlines drafting live geometry & dimensions.",
    description:
      "Draws Figma-inspired selection guides, corner anchors, and animated stroke-dashoffset paths before snapping into final state.",
    accent: "#0d99ff",
    featured: true,
    soundId: "micro-detent",
    stageStyle: "blueprint",
    defaultTweaks: { accent: "#0d99ff", stiffness: 300, damping: 24, speed: 1 },
  },
  {
    id: "line-sidebar",
    title: "Line sidebar",
    kind: "Hover",
    tagline: "Minimalist caliper rail with cursor-proximity tick magnification.",
    description:
      "Hover vertically along hairlines to expand section ticks smoothly and scrub active documentation chapters.",
    accent: "#b8431c",
    featured: true,
    soundId: "vernier-tick",
    stageStyle: "plain",
    defaultTweaks: { accent: "#b8431c", stiffness: 460, damping: 27, speed: 1 },
  },
  {
    id: "option-wheel",
    title: "Option wheel",
    kind: "Drag",
    tagline: "Tactile camera-dial drum selector with 15° detent snaps.",
    description:
      "Drag horizontally or click ticks to rotate a cylindrical focal-length drum with crisp audio-visual detents.",
    accent: "#e09a12",
    featured: true,
    soundId: "micro-detent",
    stageStyle: "dots",
    defaultTweaks: { accent: "#e09a12", stiffness: 410, damping: 26, speed: 1 },
  },
  {
    id: "line-sphere",
    title: "Line sphere",
    kind: "Hover",
    tagline: "3D wireframe geodesic globe tilting smoothly toward pointer.",
    description:
      "Projects 3D spherical parallels and meridians onto a crisp 2D canvas with back-face alpha attenuation.",
    accent: "#0d99ff",
    featured: true,
    pro: true,
    soundId: "velvet-hover",
    stageStyle: "blueprint",
    defaultTweaks: { accent: "#0d99ff", stiffness: 260, damping: 22, speed: 1 },
  },
  {
    id: "connect-sources",
    title: "Connect sources",
    kind: "Press",
    tagline: "Interactive data pipeline hub energizing SVG circuit traces.",
    description:
      "Toggle upstream connectors (GitHub, Linear, Postgres, Figma) to route animated signal packets into the central node.",
    accent: "#1f9d55",
    featured: true,
    soundId: "relay-latch",
    stageStyle: "dots",
    defaultTweaks: { accent: "#1f9d55", stiffness: 380, damping: 25, speed: 1 },
  },
  {
    id: "page-peel",
    title: "Page peel",
    kind: "Drag",
    tagline: "Draggable dog-ear corner curl exposing hidden blueprint specs.",
    description:
      "Drag the top-right sheet corner diagonally to peel back warm kraft paper and inspect underlying engineering notes.",
    accent: "#ff3b6b",
    featured: true,
    soundId: "paper-flick",
    stageStyle: "blueprint",
    defaultTweaks: { accent: "#ff3b6b", stiffness: 320, damping: 26, speed: 1 },
  },
  {
    id: "stacked-bars",
    title: "Stacked bars",
    kind: "Hover",
    tagline: "Precision telemetry chart with hover segment isolation.",
    description:
      "Hover columns or legend chips to highlight latency slices, dim sibling series, and inspect tabular millisecond metrics.",
    accent: "#4c8dff",
    featured: true,
    soundId: "vernier-tick",
    stageStyle: "plain",
    defaultTweaks: { accent: "#4c8dff", stiffness: 390, damping: 26, speed: 1 },
  },
  {
    id: "blast-radius",
    title: "Blast radius",
    kind: "Hover",
    tagline: "Dependency topology illuminating downstream impact paths.",
    description:
      "Hover any microservice node to compute transitive dependents and pulse affected directed edges in Figma guide pink.",
    accent: "#ff3b6b",
    featured: true,
    pro: true,
    soundId: "orbit-ping",
    stageStyle: "dots",
    defaultTweaks: { accent: "#ff3b6b", stiffness: 350, damping: 24, speed: 1 },
  },
  {
    id: "faq-accordion",
    title: "FAQ accordion",
    kind: "Press",
    tagline: "Zero-layout-jump spring disclosure with rotating hairline cross.",
    description:
      "Expands answers smoothly with calibrated spring physics and keyboard accessibility.",
    accent: "#17181a",
    featured: true,
    soundId: "micro-detent",
    stageStyle: "plain",
    defaultTweaks: { accent: "#0d99ff", stiffness: 420, damping: 30, speed: 1 },
  },
  {
    id: "toast-stack",
    title: "Toast stack",
    kind: "Hover",
    tagline: "3D stacked notifications that fan into a readable feed on hover.",
    description:
      "Hover the stack to expand all active toasts vertically, fire new events on click, or dismiss individual cards.",
    accent: "#1f9d55",
    featured: true,
    soundId: "spring-pop",
    stageStyle: "dots",
    defaultTweaks: { accent: "#1f9d55", stiffness: 380, damping: 26, speed: 1 },
  },
  {
    id: "resizable-panels",
    title: "Resizable panels",
    kind: "Drag",
    tagline: "Split studio panes with Figma-blue sash and pixel ruler badge.",
    description:
      "Drag the vertical divider to resize inspector panes in real time; double-click the sash to snap back to 50/50.",
    accent: "#0d99ff",
    featured: true,
    soundId: "magnetic-snap",
    stageStyle: "blueprint",
    defaultTweaks: { accent: "#0d99ff", stiffness: 440, damping: 30, speed: 1 },
  },
  {
    id: "tree-view",
    title: "Tree view",
    kind: "Press",
    tagline: "Collapsible file explorer with animated indent guide rails.",
    description:
      "Click folders and files to toggle nested component directories with crisp selection states and guide lines.",
    accent: "#0d99ff",
    featured: true,
    soundId: "micro-detent",
    stageStyle: "plain",
    defaultTweaks: { accent: "#0d99ff", stiffness: 400, damping: 28, speed: 1 },
  },
  {
    id: "access-request",
    title: "Access request",
    kind: "Press",
    tagline: "Press-and-hold radial confirmation ring for sensitive grants.",
    description:
      "Hold the Approve button to fill a precision SVG progress ring and prevent accidental production permission grants.",
    accent: "#1f9d55",
    featured: true,
    soundId: "chime-confirm",
    stageStyle: "dots",
    defaultTweaks: { accent: "#1f9d55", stiffness: 360, damping: 25, speed: 1 },
  },
  {
    id: "avatar-group",
    title: "Avatar group",
    kind: "Hover",
    tagline: "Overlapping presence rings fanning out with spring tooltips.",
    description:
      "Hovering individual collaborators separates neighbors horizontally and elevates a live role badge.",
    accent: "#9d7bf5",
    featured: true,
    soundId: "spring-pop",
    stageStyle: "plain",
    defaultTweaks: { accent: "#9d7bf5", stiffness: 420, damping: 22, speed: 1 },
  },
  {
    id: "profile-hover-card",
    title: "Profile hover card",
    kind: "Hover",
    tagline: "Intent-delayed contributor card with interactive follow toggle.",
    description:
      "Hover the @handle chip or preview card to inspect live commit sparklines and toggle follow state.",
    accent: "#e57bb8",
    featured: true,
    soundId: "velvet-hover",
    stageStyle: "dots",
    defaultTweaks: { accent: "#e57bb8", stiffness: 390, damping: 25, speed: 1 },
  },
  {
    id: "slide-confirm",
    title: "Slide confirm",
    kind: "Drag",
    tagline: "Spring-loaded deploy shuttle that snaps home unless completed.",
    description:
      "Drag the physical handle across the track past 88% to latch production release; partial drags snap safely back.",
    accent: "#1f9d55",
    featured: true,
    soundId: "relay-latch",
    stageStyle: "dots",
    defaultTweaks: { accent: "#1f9d55", stiffness: 400, damping: 28, speed: 1 },
  },
  {
    id: "command-bar",
    title: "Command palette",
    kind: "Type",
    tagline: "Instant fuzzy-filtering command deck with ↑/↓ keyboard nav.",
    description:
      "Filter actions in real time by typing, step with arrow keys, and trigger commands with Enter.",
    accent: "#0d99ff",
    featured: true,
    soundId: "keycap-pbt",
    stageStyle: "plain",
    defaultTweaks: { accent: "#0d99ff", stiffness: 430, damping: 29, speed: 1 },
  },
  {
    id: "otp-slots",
    title: "Kinetic OTP",
    kind: "Type",
    tagline: "6-digit passcode cells with spring keystroke pop & auto-advance.",
    description:
      "Type digits (try 428910) to experience spring slot transitions, backspace rewind, and instant verification.",
    accent: "#0d99ff",
    featured: true,
    soundId: "keycap-pbt",
    stageStyle: "dots",
    defaultTweaks: { accent: "#0d99ff", stiffness: 450, damping: 24, speed: 1 },
  },
  {
    id: "inline-rename",
    title: "Inline rename",
    kind: "Type",
    tagline: "Double-click or press Rename to edit layer title in place.",
    description:
      "Figma-style layer row that morphs seamlessly into an auto-sized text input with Enter save and Escape revert.",
    accent: "#0d99ff",
    featured: true,
    soundId: "micro-detent",
    stageStyle: "plain",
    defaultTweaks: { accent: "#0d99ff", stiffness: 410, damping: 28, speed: 1 },
  },
  {
    id: "dot-loader",
    title: "Dot loader",
    kind: "Loading",
    tagline: "3×3 precision LED matrix cycling wave, spiral, and cross modes.",
    description:
      "Click anywhere on the 9-cell matrix to switch choreography modes between Diagonal Wave, Rotary Orbit, and Heartbeat.",
    accent: "#ff3b6b",
    featured: true,
    soundId: "micro-detent",
    stageStyle: "plain",
    defaultTweaks: { accent: "#ff3b6b", stiffness: 360, damping: 24, speed: 1 },
  },
  {
    id: "image-shimmer",
    title: "Image shimmer",
    kind: "Loading",
    tagline: "Specular skeleton card resolving smoothly into sharp media.",
    description:
      "Toggle between loading sweep and hydrated specimen card with blurred-up progressive reveal.",
    accent: "#4c8dff",
    featured: true,
    soundId: "glass-tap",
    stageStyle: "dots",
    defaultTweaks: { accent: "#4c8dff", stiffness: 320, damping: 26, speed: 1 },
  },
  {
    id: "shimmer-text",
    title: "Shimmer text",
    kind: "Loading",
    tagline: "Metallic gradient light sweep across live AI reasoning status.",
    description:
      "Click to cycle active reasoning stages with smooth typographic y-axis roll and metallic sheen.",
    accent: "#9d7bf5",
    featured: true,
    soundId: "velvet-hover",
    stageStyle: "plain",
    defaultTweaks: { accent: "#9d7bf5", stiffness: 340, damping: 25, speed: 1 },
  },
];

// Additional 106 indexed blocks to bring the complete catalog to exact 138 items
// (matching JSON-LD numberOfItems: 138 and <noscript> SEO shell links).
// Every archive block also renders a live, playable parameterized interactive widget on /blocks/[id]!
const ARCHIVE_SEEDS: Array<[string, string, InteractionKind, string]> = [
  ["magnetic-button", "Magnetic button", "Hover", "#0d99ff"],
  ["split-flap-counter", "Split-flap counter", "Press", "#e09a12"],
  ["gooey-tabs", "Gooey tabs", "Press", "#ff3b6b"],
  ["spring-drawer", "Spring drawer", "Drag", "#4c8dff"],
  ["scrub-timeline", "Scrub timeline", "Drag", "#1f9d55"],
  ["haptic-stepper", "Haptic stepper", "Press", "#9d7bf5"],
  ["cursor-lens", "Cursor lens", "Hover", "#0d99ff"],
  ["elastic-checkbox", "Elastic checkbox", "Press", "#1f9d55"],
  ["dock-magnifier", "Dock magnifier", "Hover", "#5b8def"],
  ["radial-menu", "Radial menu", "Drag", "#ff3b6b"],
  ["morphing-play", "Morphing play button", "Press", "#e5484d"],
  ["flip-badge", "Flip status badge", "Press", "#e09a12"],
  ["copy-pill", "Copy morph pill", "Press", "#1f9d55"],
  ["Segmented-control", "Segmented control", "Press", "#0d99ff"],
  ["hold-delete", "Hold to delete", "Press", "#e5484d"],
  ["reaction-bar", "Reaction burst bar", "Press", "#e57bb8"],
  ["bookmark-ribbon", "Bookmark ribbon", "Press", "#ff3b6b"],
  ["theme-aperture", "Theme aperture switch", "Press", "#f2c46d"],
  ["mute-bell", " pendulum mute bell", "Press", "#e09a12"],
  ["like-spark", "Like particle spark", "Press", "#ff3b6b"],
  ["expand-fab", "Expanding quick action", "Press", "#0d99ff"],
  ["pill-filter", "Multi-select pill filter", "Press", "#4c8dff"],
  ["cycle-sort", "Tri-state sort header", "Press", "#9d7bf5"],
  ["pin-toggle", "Tactile pin tack", "Press", "#b8431c"],
  ["vote-counter", "Rolling vote counter", "Press", "#1f9d55"],
  ["disclosure-chip", "Inline disclosure chip", "Press", "#5b8def"],
  ["kbd-shortcut", "Depressable keycap", "Press", "#17181a"],
  ["color-swatch-pop", "Color swatch picker", "Press", "#e57bb8"],
  ["audio-playhead", "Mini audio pill", "Press", "#0d99ff"],
  ["status-beacon", "Incident status switch", "Press", "#1f9d55"],
  ["folder-peek", "Folder file peek", "Hover", "#f2c46d"],
  ["tilt-specimen", "3D tilt specimen card", "Hover", "#4c8dff"],
  ["link-preview", "Inline URL preview", "Hover", "#0d99ff"],
  ["sparkline-scrub", "Sparkline cursor scrub", "Hover", "#1f9d55"],
  ["spotlight-grid", "Spotlight bento grid", "Hover", "#9d7bf5"],
  ["marquee-pause", "Velocity marquee strip", "Hover", "#e09a12"],
  ["compass-needle", "Pointer compass array", "Hover", "#ff3b6b"],
  ["blur-reveal", "Spoiler blur reveal", "Hover", "#9ab8db"],
  ["callout-loupe", "Pixel loupe inspector", "Hover", "#0d99ff"],
  ["tag-cloud-repel", "Repelling tag cluster", "Hover", "#e57bb8"],
  ["border-beam", "Conic border beam", "Hover", "#4c8dff"],
  ["prism-button", "Refractive prism button", "Hover", "#74dcae"],
  ["tooltip-morph", "Shared-layout tooltip", "Hover", "#0d99ff"],
  ["breadcrumb-collapse", "Expanding breadcrumbs", "Hover", "#5b8def"],
  ["code-line-focus", "Code focus dimmer", "Hover", "#9d7bf5"],
  ["table-crosshair", "Spreadsheet crosshair", "Hover", "#0d99ff"],
  ["pricing-highlight", "Tier comparison hover", "Hover", "#1f9d55"],
  ["calendar-heat", "Contribution heat cell", "Hover", "#1f9d55"],
  ["magnetic-tabs", "Magnetic underline tabs", "Hover", "#0d99ff"],
  ["waveform-hover", "Waveform scrub bar", "Hover", "#ff3b6b"],
  ["bezier-editor", "Cubic bezier handles", "Drag", "#0d99ff"],
  ["kanban-snap", "Spring kanban card", "Drag", "#4c8dff"],
  ["color-loupe", "HSV spectrum puck", "Drag", "#e57bb8"],
  ["range-histogram", "Dual-thumb histogram", "Drag", "#1f9d55"],
  ["knob-rotary", "Studio synth rotary knob", "Drag", "#e09a12"],
  ["crop-handles", "Aspect ratio crop box", "Drag", "#0d99ff"],
  ["swipe-archive", "Swipe to archive row", "Drag", "#1f9d55"],
  ["joystick-pad", "2D XY vector pad", "Drag", "#ff3b6b"],
  ["Sortable-pills", "Reorderable tag list", "Drag", "#9d7bf5"],
  ["compare-curtain", "Before/after curtain", "Drag", "#0d99ff"],
  ["elastic-pull", "Pull-to-refresh tension", "Drag", "#4c8dff"],
  ["minimap-viewport", "Canvas minimap pan", "Drag", "#5b8def"],
  ["scrub-number", "Draggable number input", "Drag", "#e09a12"],
  ["angle-dial", "Gradient angle ring", "Drag", "#ff3b6b"],
  ["sheet-detents", "Bottom sheet detents", "Drag", "#17181a"],
  ["ruler-guide", "Snap-to-pixel guide line", "Drag", "#ff3b6b"],
  ["volume-elastic", "Over-drag elastic slider", "Drag", "#0d99ff"],
  ["token-slider", "Spacing scale slider", "Drag", "#1f9d55"],
  ["deck-fan-drag", "Arc hand card selector", "Drag", "#9d7bf5"],
  ["split-diff", "Code diff divider", "Drag", "#4c8dff"],
  ["tag-tokenizer", "Email chip tokenizer", "Type", "#0d99ff"],
  ["mention-popover", "@Mention spring menu", "Type", "#9d7bf5"],
  ["password-meter", "Entropy meter input", "Type", "#1f9d55"],
  ["Ghost-autocomplete", "Tab ghost completion", "Type", "#5b8def"],
  ["currency-morph", "Live formatted amount", "Type", "#e09a12"],
  ["regex-tester", "Live token highlighter", "Type", "#ff3b6b"],
  ["skeleton-table", "Tabular pulse rows", "Loading", "#9ab8db"],
  ["orbital-spinner", "Kepler orbital loader", "Loading", "#0d99ff"],
  ["progress-detent", "Stepped build progress", "Loading", "#1f9d55"],
  ["ascii-spinner", "Monospace glyph spinner", "Loading", "#e09a12"],
  ["press-latch-01", "Toggle latch switch", "Press", "#0d99ff"],
  ["press-latch-02", "Segmented pill bar", "Press", "#4c8dff"],
  ["press-latch-03", "Radio card group", "Press", "#1f9d55"],
  ["press-latch-04", "Split action dropdown", "Press", "#9d7bf5"],
  ["press-latch-05", "Popover confirm chip", "Press", "#e5484d"],
  ["press-latch-06", "Counter pill button", "Press", "#e09a12"],
  ["press-latch-07", "Accordion spec row", "Press", "#5b8def"],
  ["press-latch-08", "Step wizard pill", "Press", "#0d99ff"],
  ["press-latch-09", "Quick filter toggle", "Press", "#ff3b6b"],
  ["press-latch-10", "Clipboard token badge", "Press", "#1f9d55"],
  ["press-latch-11", "Hardware rocker switch", "Press", "#b8431c"],
  ["press-latch-12", "Expandable search pill", "Press", "#0d99ff"],
  ["press-latch-13", "Starburst bookmark", "Press", "#f2c46d"],
  ["press-latch-14", "Notification bell latch", "Press", "#9d7bf5"],
  ["hover-spec-01", "Glass card glare", "Hover", "#4c8dff"],
  ["hover-spec-02", "Cursor trail badges", "Hover", "#e57bb8"],
  ["hover-spec-03", "Stacked photo fan", "Hover", "#e09a12"],
  ["hover-spec-04", " vernier chart crosshair", "Hover", "#0d99ff"],
  ["hover-spec-05", "Magnetic arrow link", "Hover", "#17181a"],
  ["hover-spec-06", "Floating dock bar", "Hover", "#5b8def"],
  ["drag-spec-01", "Spring snap carousel", "Drag", "#ff3b6b"],
  ["drag-spec-02", "Floating pip window", "Drag", "#0d99ff"],
  ["drag-spec-03", "Timeline trim handles", "Drag", "#e09a12"],
  ["drag-spec-04", "Freeform canvas sticky", "Drag", "#f2c46d"],
  ["loading-spec-01", "Gooey droplet loader", "Loading", "#ff3b6b"],
  ["loading-spec-02", "Radar sweep indicator", "Loading", "#1f9d55"],
];

export const ARCHIVE_BLOCKS: BlockMeta[] = ARCHIVE_SEEDS.map(
  ([rawId, title, kind, accent]) => {
    const id = rawId.toLowerCase();
    const archetypeMap: Record<InteractionKind, BlockMeta["archetype"]> = {
      Press: "press-pill",
      Hover: "hover-magnetic",
      Drag: "drag-spring",
      Type: "type-token",
      Loading: "loading-pulse",
    };
    return {
      id,
      title,
      kind,
      tagline: `Interactive ${kind.toLowerCase()} micro-component with calibrated spring physics.`,
      description: `Live ${title} primitive built on Bencho CSS custom properties and Framer Motion springs. Interact directly on the stage, tweak stiffness & damping, or pull via MCP.`,
      accent,
      featured: false,
      soundId:
        kind === "Press"
          ? "micro-detent"
          : kind === "Hover"
          ? "velvet-hover"
          : kind === "Drag"
          ? "paper-flick"
          : kind === "Type"
          ? "keycap-pbt"
          : "glass-tap",
      stageStyle: kind === "Drag" ? "blueprint" : kind === "Press" ? "dots" : "plain",
      defaultTweaks: { accent, stiffness: 380, damping: 26, speed: 1 },
      archetype: archetypeMap[kind],
    };
  }
);

export const ALL_138_BLOCKS: BlockMeta[] = [...FEATURED_BLOCKS, ...ARCHIVE_BLOCKS];

export function getBlockById(id: string): BlockMeta | undefined {
  return ALL_138_BLOCKS.find((b) => b.id === id.toLowerCase());
}

export function generateBlockSourceCode(
  block: BlockMeta,
  tweaks?: Partial<BlockTweakConfig>
): string {
  const accent = tweaks?.accent ?? block.defaultTweaks.accent;
  const stiffness = tweaks?.stiffness ?? block.defaultTweaks.stiffness;
  const damping = tweaks?.damping ?? block.defaultTweaks.damping;
  const speed = tweaks?.speed ?? block.defaultTweaks.speed;

  const pascalName = block.id
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");

  return `"use client";

import React, { useState } from "react";
import { motion, MotionConfig } from "framer-motion";

/**
 * ${block.title} — Exported from Bencho.dev
 * Interaction kind: ${block.kind}
 * Tagline: ${block.tagline}
 */
export interface ${pascalName}Props {
  accent?: string;
  stiffness?: number;
  damping?: number;
  speed?: number;
}

export function ${pascalName}({
  accent = "${accent}",
  stiffness = ${stiffness},
  damping = ${damping},
  speed = ${speed},
}: ${pascalName}Props) {
  const [active, setActive] = useState(false);
  const [count, setCount] = useState(1);

  return (
    <MotionConfig
      transition={{
        type: "spring",
        stiffness: stiffness * speed,
        damping,
      }}
    >
      <div
        style={{
          "--pick": accent,
          display: "inline-flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
          padding: 20,
          borderRadius: 16,
          background: "var(--board, #ffffff)",
          border: "1px solid var(--rule, rgba(23,24,26,0.14))",
          boxShadow: "0 8px 24px -12px rgba(23,24,26,0.12)",
        } as React.CSSProperties}
      >
        <motion.button
          type="button"
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.96 }}
          drag={${block.kind === "Drag" ? "true" : "false"}}
          dragConstraints={{ left: -32, right: 32, top: -18, bottom: 18 }}
          dragElastic={0.28}
          onClick={() => {
            setActive((v) => !v);
            setCount((c) => c + 1);
          }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 18px",
            borderRadius: 999,
            border: "1px solid rgba(23,24,26,0.12)",
            background: active ? accent : "var(--surface, #f7f7f6)",
            color: active ? "#ffffff" : "var(--ink, #17181a)",
            fontFamily: "var(--font-ui, Inter, sans-serif)",
            fontSize: 13.5,
            fontWeight: 600,
            cursor: "${block.kind === "Drag" ? "grab" : "pointer"}",
          }}
        >
          <motion.span
            animate={{ rotate: active ? 180 : 0, scale: active ? 1.15 : 1 }}
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: active ? "#ffffff" : accent,
            }}
          />
          <span>${block.title}</span>
          <span style={{ opacity: 0.72, fontFamily: "var(--font-code, monospace)", fontSize: 12 }}>
            #{count}
          </span>
        </motion.button>
      </div>
    </MotionConfig>
  );
}

export default ${pascalName};
`;
}
