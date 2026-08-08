export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  description: string;
}

export const ACTIVE_COUPONS: Coupon[] = [
  { code: 'ELEVATE10', discountType: 'percentage', discountValue: 10, description: '১০% বিশেষ ছাড়' },
  { code: 'ELEVATE20', discountType: 'percentage', discountValue: 20, description: '২০% বাম্পার মূল্যছাড়' },
  { code: 'SAVE500', discountType: 'fixed', discountValue: 500, description: '৳৫০০ ফ্ল্যাট ডিসকাউন্ট' },
  { code: 'WELCOME15', discountType: 'percentage', discountValue: 15, description: '১৫% নতুন গ্রাহক ছাড়' }
];

export function validateCoupon(code: string, subtotal: number, userUsedCoupons: string[] = []) {
  const normalized = code.trim().toUpperCase();
  const coupon = ACTIVE_COUPONS.find(c => c.code === normalized);
  
  if (!coupon) {
    return {
      valid: false,
      message: 'অবৈধ কুপন কোড! দয়া করে সঠিক কুপন ইনপুট লিখুন।',
      discountAmount: 0
    };
  }

  // Check if coupon code has already been redeemed by user
  const isAlreadyUsed = userUsedCoupons.some(c => c.trim().toUpperCase() === normalized);
  if (isAlreadyUsed) {
    return {
      valid: false,
      message: `আপনি '${normalized}' কুপন কোডটি ইতোমধ্যেই একবার ব্যবহার করেছেন! এই কুপনটি পুনরায় ব্যবহার করা সম্ভব নয়।`,
      discountAmount: 0
    };
  }

  let discount = 0;
  if (coupon.discountType === 'percentage') {
    discount = Math.round((subtotal * coupon.discountValue) / 100);
  } else {
    discount = Math.min(coupon.discountValue, subtotal);
  }

  return {
    valid: true,
    coupon,
    discountAmount: discount,
    message: `কুপন '${coupon.code}' সফলভাবে যুক্ত হয়েছে! (${coupon.description})`
  };
}
