// SWR 请求配置

// 基础 URL，可根据环境配置
export const BASE_URL = 'https://api.example.com';

// 自定义请求头
const getHeaders = () => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    // 可添加其他自定义头，如认证信息
  };
  
  return headers;
};

// GET 请求
export const get = async <T>(url: string): Promise<T> => {
  const response = await fetch(`${BASE_URL}${url}`, {
    method: 'GET',
    headers: getHeaders(),
  });
  
  if (!response.ok) {
    throw new Error(`请求失败: ${response.status}`);
  }
  
  return response.json();
};

// POST 请求
export const post = async <T>(url: string, data: any): Promise<T> => {
  const response = await fetch(`${BASE_URL}${url}`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error(`请求失败: ${response.status}`);
  }
  
  return response.json();
};

// PUT 请求
export const put = async <T>(url: string, data: any): Promise<T> => {
  const response = await fetch(`${BASE_URL}${url}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error(`请求失败: ${response.status}`);
  }
  
  return response.json();
};

// DELETE 请求
export const del = async <T>(url: string): Promise<T> => {
  const response = await fetch(`${BASE_URL}${url}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  
  if (!response.ok) {
    throw new Error(`请求失败: ${response.status}`);
  }
  
  return response.json();
};

// 用于 SWR 的 fetcher 函数
export const fetcher = async <T>(url: string): Promise<T> => {
  return get<T>(url);
};
