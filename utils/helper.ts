import uuid from "uuid-random";

export function getUser() {
  let uid = localStorage.getItem("uuid");
  if (uid) {
    return uid;
  }

  uid = uuid();
  localStorage.setItem("uuid", uid);
  return uid;
}
