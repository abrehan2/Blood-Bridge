// errorHandle.ts -
export type errorProps = {
  message: string;
  statusCode: number;
};

// error.ts -
export type errorMiddlewareProp = {
  err: any;
  req?: any;
  res?: any;
  next?: any;
};
