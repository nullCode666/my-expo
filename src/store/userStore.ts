import { create } from 'zustand';

// 定义用户类型
export type UserType = 'mockLocation' | 'lookTV' | 'moduleC' | null;

// 定义密钥类型映射
const KEY_TYPE_MAP: Record<string, UserType> = {
  'test1': 'mockLocation',
  'test2': 'lookTV',
  'test3': 'moduleC',
};

// 定义 store 类型
interface UserStore {
  userType: UserType;
  secretKey: string;
  isValidKey: boolean;
  error: string | null;
  setSecretKey: (key: string) => void;
  validateKey: () => boolean;
  reset: () => void;
}

// 创建 store
export const useUserStore = create<UserStore>((set, get) => ({
  userType: null,
  secretKey: '',
  isValidKey: false,
  error: null,

  // 设置密钥
  setSecretKey: (key) => {
    set({ secretKey: key, error: null });
  },

  // 验证密钥
  validateKey: () => {
    const { secretKey } = get();
    const userType = KEY_TYPE_MAP[secretKey];
    
    if (userType) {
      set({ userType, isValidKey: true, error: null });
      return true;
    } else {
      set({ userType: null, isValidKey: false, error: '无效的密钥' });
      return false;
    }
  },

  // 重置状态
  reset: () => {
    set({ userType: null, secretKey: '', isValidKey: false, error: null });
  },
}));
