import client from "./internal/httpClient";

// 线上课详情
export function detail(id: number) {
  return client.get(`/api/v1/course/${id}`, {});
}

// 线上课课时详情
export function play(courseId: number, id: number) {
  return client.get(`/api/v1/course/${courseId}/hour/${id}`, {});
}

// 获取播放地址
export function playUrl(courseId: number, hourId: number) {
  return client.get(`/api/v1/course/${courseId}/hour/${hourId}/play`, {});
}

// 记录学员观看时长
export function record(courseId: number, hourId: number, duration: number) {
  return client.post(`/api/v1/course/${courseId}/hour/${hourId}/record`, {
    duration,
  });
}

//观看ping
export function playPing(courseId: number, hourId: number) {
  return client.post(`/api/v1/course/${courseId}/hour/${hourId}/ping`, {});
}

//最近学习课程
export function latestLearn() {
  return client.get(`/api/v1/user/latest-learn`, {});
}

//下载课件
export function downloadAttachment(courseId: number, id: number) {
  return client.get(`/api/v1/course/${courseId}/attach/${id}/download`, {});
}

// 获取pdf预览的在线地址
export function pdfOnlineUrl(courseId: number, hourId: number) {
  return client.get(`/api/v1/course/${courseId}/hour/${hourId}/play`, {});
}

// 记录学员观看pdf时长
export function pdfRecord(courseId: number, hourId: number, duration: number) {
  return client.post(`/api/v1/course/${courseId}/hour/${hourId}/record`, {
    duration,
  });
}

//pdf观看ping
export function pdfPlayPing(courseId: number, hourId: number) {
  return client.post(`/api/v1/course/${courseId}/hour/${hourId}/ping`, {});
}

// 学习中心的课件 点 学习课程 调用（记录学员学习）
export function recordLearning(courseId: number, userId: number) {
  return client.get(`/api/v1/course/${courseId}/study/${userId}`, {});
}

// 删除视频进度
export function removeHourRecordLearning(courseId: number) {
  return client.destroy(`/api/v1/course/${courseId}/hour/removeLearningStatus`);
}

// 删除pdf进度
export function removePdfRecordLearning(courseId: number) {
  return client.destroy(`/api/v1/course/${courseId}/hour/removeLearningStatus`);
}

// 删除选修课接口
// 删除接口用get方式？_？
export function deleteElectiveCoursesApi(courseId: number) {
  return client.get(`/api/v1/user/delete/${courseId}`, {});
}

// 获取所有标签
export function getAllLabels() {
  return client.get(`/api/v1/label/all`, {});
}