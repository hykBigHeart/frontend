import client from "./internal/httpClient";

export function detail() {
  return client.get("/api/v1/user/detail", {});
}

// 修改密码
export function password(oldPassword: string, newPassword: string) {
  return client.put("/api/v1/user/password", {
    old_password: oldPassword,
    new_password: newPassword,
  });
}

// 学员课程
export function coursesCategories() {
  return client.get("/api/v1/category/all", {});
}
export function courses(depId: number,userId: number, categoryId: number, page: number, size: number) {
  return client.get("/api/v1/user/courses", {
    // dep_id: depId,
    user_id: userId,
    category_id: categoryId,
    page,
    size
  });
}

// 修改头像
export function avatar(file: any) {
  return client.put("/api/v1/user/avatar", {
    file: file,
  });
}


// 学习中心接口
export function AllCourses(userId: number, title: string, page: number, size: number) {
  return client.get("/api/v1/course/index", {
    user_id: userId,
    title,
    page,
    size
  });
}