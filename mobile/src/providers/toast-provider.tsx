import { CheckCircle2, Info, XCircle } from 'lucide-react-native';
import { createContext, type PropsWithChildren, useCallback, useContext, useRef, useState } from 'react';
import { Animated, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ToastType = 'success' | 'info' | 'error';
interface ToastState {
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const TOAST_STYLES: Record<ToastType, { bg: string; icon: typeof CheckCircle2 }> = {
  success: { bg: 'bg-ink dark:bg-ink-dark', icon: CheckCircle2 },
  info: { bg: 'bg-ink dark:bg-ink-dark', icon: Info },
  error: { bg: 'bg-red-600', icon: XCircle },
};

export function ToastProvider({ children }: PropsWithChildren) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const [opacity] = useState(() => new Animated.Value(0));
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const insets = useSafeAreaInsets();

  const showToast = useCallback(
    (message: string, type: ToastType = 'success') => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setToast({ message, type });
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }).start();
      timeoutRef.current = setTimeout(() => {
        Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => setToast(null));
      }, 2800);
    },
    [opacity]
  );

  const Icon = toast ? TOAST_STYLES[toast.type].icon : null;

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast ? (
        <Animated.View
          pointerEvents="none"
          style={{ opacity, bottom: insets.bottom + 88 }}
          className="absolute inset-x-4 z-50"
        >
          <View className={`flex-row items-center gap-2 rounded-2xl px-4 py-3 shadow-lg ${TOAST_STYLES[toast.type].bg}`}>
            {Icon ? <Icon size={18} color="#fff" /> : null}
            <Text className="flex-1 text-sm font-medium text-white">{toast.message}</Text>
          </View>
        </Animated.View>
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}
