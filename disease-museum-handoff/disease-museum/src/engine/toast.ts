// 画面下のトースト
let el: HTMLElement | null = null;
let timer = 0;

export function mountToast() {
  el = document.createElement("div");
  el.className = "toast";
  el.id = "toast";
  el.setAttribute("role", "status");
  document.body.append(el);
}

export function toast(t: string) {
  if (!el) return;
  el.textContent = t;
  el.classList.add("show");
  clearTimeout(timer);
  timer = window.setTimeout(() => el!.classList.remove("show"), 2400);
}
