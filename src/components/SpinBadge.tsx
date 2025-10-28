interface SpinBadgeProps {
  type: 'S' | 'P';
}

export const SpinBadge = ({ type }: SpinBadgeProps) => {
  if (type === 'S') {
    return (
      <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white font-black text-sm shadow-lg border-2 border-blue-600">
        S
      </div>
    );
  }

  return (
    <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-orange-500 text-white font-black text-sm shadow-lg border-2 border-orange-600">
      P
    </div>
  );
};
