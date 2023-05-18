const isIframe = (input: Element | null): input is HTMLIFrameElement =>
  input !== null && input.tagName === "IFRAME";

export function sendEventToIframe(element: string, event: string, data: any) {
  try {
    const el = document.querySelector(element);
    if (el && isIframe(el) && el.contentWindow) {
      el.contentWindow.postMessage(
        JSON.stringify({
          event,
          data,
        }),
        "*"
      );
    }
  } catch (e) {
    console.log(e);
  }
}

export function sendEventToParent(event: string, data: any) {
  if (parent) {
    parent.postMessage(
      JSON.stringify({
        event,
        data,
      }),
      "*"
    );
  }
}
