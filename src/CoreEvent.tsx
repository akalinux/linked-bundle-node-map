interface CoreEvent<T> {
  name:string;  
  tag:string;
  getData():T;
}

export default CoreEvent