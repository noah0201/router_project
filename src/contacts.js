import localforage from "localforage";
import { matchSorter } from "match-sorter";
import sortBy from "sort-by";

export async function getContacts(query) {
  // 模拟网络延迟
  await fakeNetwork(`getContacts:${query}`);
  // 拿数据
  let contacts = await localforage.getItem("contacts");
  // 如果数据为空则设为空list
  if (!contacts) contacts = [];
  if (query) {
    // 寻找特定信息
    contacts = matchSorter(contacts, query, { keys: ["first", "last"] });
  }
  //  排序
  return contacts.sort(sortBy("last", "createdAt"));
}

export async function createContact() {
  // 模拟网络延迟
  await fakeNetwork();
  // 产生随机id 26 个字母 + 10个数字 
  let id = Math.random().toString(36).substring(2, 9);
  // 创建 contact
  let contact = { id, createdAt: Date.now() };
  // 获取数据，没有也能制造空list
  let contacts = await getContacts();
  // 头部插入
  contacts.unshift(contact);
  // 重新设置 contacts
  await set(contacts);
  // 返回生成的 contact
  return contact;
}

// 寻找特定联系人
export async function getContact(id) {
  await fakeNetwork(`contact:${id}`);
  let contacts = await localforage.getItem("contacts");
  let contact = contacts.find(contact => contact.id === id);
  return contact ?? null;
}

// 更新特定联系人
export async function updateContact(id, updates) {
  await fakeNetwork();
  let contacts = await localforage.getItem("contacts");
  let contact = contacts.find(contact => contact.id === id);
  if (!contact) throw new Error("No contact found for", id);
  Object.assign(contact, updates); // => [...contact, ...updates]
  await set(contacts);
  return contact;
}

// 删除特定联系人
export async function deleteContact(id) {
  let contacts = await localforage.getItem("contacts");
  let index = contacts.findIndex(contact => contact.id === id);
  if (index > -1) {
    // 删除list特定位置
    contacts.splice(index, 1);
    await set(contacts);
    return true;
  }
  return false;
}

function set(contacts) {
  return localforage.setItem("contacts", contacts);
}

// fake a cache so we don't slow down stuff we've already seen
let fakeCache = {};


// 模拟网络延迟
async function fakeNetwork(key) {
  if (!key) {
    fakeCache = {};
  }

  if (fakeCache[key]) {
    return;
  }

  fakeCache[key] = true;
  return new Promise(res => {
    // 随机产生 0-800毫秒
    setTimeout(res, Math.random() * 800);
  });
}