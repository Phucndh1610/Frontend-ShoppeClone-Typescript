export interface SuccessResponse<Data> {
  message: string
  data: Data
}
export interface ErrorResponse<Data> {
  message: string
  data?: Data
}

// cú pháp `-?` sẽ loại bỏ undefined key optional
export type NoUndefinedFiend<T> = {
  [P in keyof T]-?: NoUndefinedFiend<NonNullable<T[P]>>
}
