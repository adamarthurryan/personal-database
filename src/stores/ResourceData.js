export default class ResourceData {
  constructor(resource) {
    this.resource=resource;
    this.state=LOADING;
    this.data=null;
    this.error=null;
  }

  loaded(data) {
    this.state=LOADED;
    this.data=data;
    return this;
  }

  failed(error) {
    this.state=FAILED;
    this.error=error;
    return this;
  }

  isFailed() {
    return this.state == FAILED;
  }

  isLoaded() {
    return this.state == LOADED;
  }

  isLoading() {
    return this.state == LOADING;
  }
}

const LOADING=0;
const LOADED=1;
const FAILED=2;

//states: ["loading", "failed", "loaded"]

