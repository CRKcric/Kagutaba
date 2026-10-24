const base = import.meta.env.BASE_URL;
const img = (file, blend = "normal") => ({ src: `${base}images/${file}`, blend });

export const ASSETS = {
  scenes: {
    house: img("bg-house.webp"),
    archive: img("bg-archive.webp"),
    shrine: img("bg-shrine.webp"),
  },
  ghost: img("ghost.png", "multiply"),
  ghostFacing: img("ghost-face.png", "multiply"),
  face: img("face.webp"), // jumpscare, sits on black
  seal: img("seal.png"), // sits on black
  stain: img("stain.png", "multiply"),
  hair: img("hair.png", "multiply"),
  filmstrip: img("filmstrip.png", "multiply"),
  tapeLabel: img("tape-label.png"),
  icons: {
    bow: img("icon-bow.png", "multiply"),
    clap: img("icon-clap.png", "multiply"),
    offer: img("icon-offer.png", "multiply"),
    name: img("icon-name.png", "multiply"),
  },
};

export const blendStyle = (asset) => ({ mixBlendMode: asset.blend });

export const allSources = () => [
  ASSETS.ghost.src,
  ASSETS.ghostFacing.src,
  ASSETS.face.src,
  ASSETS.seal.src,
  ASSETS.stain.src,
  ASSETS.hair.src,
  ASSETS.filmstrip.src,
  ASSETS.tapeLabel.src,
  ...Object.values(ASSETS.icons).map((a) => a.src),
  ...Object.values(ASSETS.scenes).map((a) => a.src),
];