import { getUserTypeByKey } from '@/src/config/moduleAccess';
import { create } from 'zustand';

// 定义用户类型
export type UserType = 'mockLocation' | 'lookTV' | 'moduleC' | null;

// 定义 store 类型
interface UserStore {
  userType: UserType;
  secretKey: string;
  isValidKey: boolean;
  error: string | null;
  setSecretKey: (key: string) => void;
  validateKey: (key?: string) => UserType;
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
  validateKey: (inputKey) => {
    const rawSecretKey = inputKey ?? get().secretKey;
    const secretKey = rawSecretKey.trim();
    const userType = getUserTypeByKey(secretKey);
    
    if (userType) {
      set({ secretKey, userType, isValidKey: true, error: null });
      return userType;
    } else {
      set({ secretKey, userType: null, isValidKey: false, error: '无效的密钥' });
      return null;
    }
  },

  // 重置状态
  reset: () => {
    set({ userType: null, secretKey: '', isValidKey: false, error: null });
  },
}));
