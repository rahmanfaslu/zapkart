export default function getImageSrc(product) {
  if (!product) return "/shingify.png";
  const maybe = product.image || (Array.isArray(product.images) && product.images[0]) || product.imageUrl || "";
  if (!maybe) return "/shingify.png";
  if (/^https?:\/\//i.test(maybe) || maybe.startsWith("data:")) return maybe;
  return maybe.startsWith("/") ? maybe : `/${maybe}`;
}
