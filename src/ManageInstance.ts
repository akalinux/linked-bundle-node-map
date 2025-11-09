export default class ManageInstance<T> {
  constructor(obj: T, pooled = false) {
    this.n = this.obj = obj;
    this.pooled = pooled
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  p: any = null;
  n: T;
  stop = true;
  pid = 0;
  pooled = false;
  obj: T;
  id = 0;
  subs: { [key: number]: (obj: T) => void } = {}
  subscribe() {
    const ss: [(sub: (obj: T) => void) => () => void, () => T] = [
      (sub: (obj: T) => void) => {
        const id = this.addSub(sub);
        return () => {
          this.onIdCleanup(id);
        }
      },
      this.getObj
    ];
    return ss;
  }

  addSub(cb: (obj: T) => void) {
    if (Object.keys(this.subs).length == 0) this.onSubs();
    const id = ++this.id;
    this.subs[id] = cb;
    return id;
  }

  onIdCleanup(id: number) {
    delete this.subs[id];
    if (Object.keys(this.subs).length == 0) this.onNoSubs();
  }

  onNoSubs = () => { };
  onSubs = () => { }

  watch(cb: (obj: T) => void) {
    const id = this.addSub(cb)
    const rv: [number, T] = [id, this.obj];
    return rv;
  }

  unwatch(id: number) {
    this.onIdCleanup(id);
  }

  getObj = () => { return this.obj; }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onPush = (m: ManageInstance<T>) => { }

  publish(obj: T) {
    if (this.pooled) {
      if (Object.keys(this.subs).length == 0) {
        this.stop = true;
        this.p = null;
        ++this.pid;
        this.#_publish(obj);
      } else {
        this.stop = false;
        this.n = obj;
        if (!this.p) {
          const id = ++this.pid;
          this.p = Promise.resolve().then(
            () => {
              if (id != this.pid) return;
              if (this.stop) return;
              const { n } = this;
              this.p = null;
              this.#_publish(n);
            }
          );
        }
      }
    } else {
      this.#_publish(obj);
    }
  }

  #_publish(obj: T) {
    if (this.obj === obj) return;
    this.obj = obj;

    this.onPush(this);
    for (const cb of Object.values(this.subs)) {
      cb(obj);
    }
  }
}

