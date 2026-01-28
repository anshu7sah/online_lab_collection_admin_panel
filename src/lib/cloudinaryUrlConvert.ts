export const getInlinePdfUrl = (url: string) => {
  return url.replace("/upload/", "/upload/fl_attachment:false/");
};
