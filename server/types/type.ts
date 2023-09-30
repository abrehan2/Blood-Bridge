// errorHandle.ts -
export type errorProps = {
  message: string;
  statusCode: number;
};

// error.ts -
export type errorMiddlewareProp = {
  error: any;
  req?: any;
  res?: any;
  next?: any;
};
