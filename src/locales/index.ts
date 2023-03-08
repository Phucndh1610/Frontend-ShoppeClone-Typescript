// vietnamese
import home_vi_VN from './vi-VN/home.json'
import cart_vi_VN from './vi-VN/cart.json'
import profile_vi_VN from './vi-VN/profile.json'
import auth_vi_VN from './vi-VN/auth.json'

// English
import home_en_US from './en-US/home.json'
import cart_en_US from './en-US/cart.json'
import profile_en_US from './en-US/profile.json'
import auth_en_US from './en-US/auth.json'

export const ProjectLanguage = {
  en: {
    translation: {
      ...home_en_US,
      ...cart_en_US,
      ...profile_en_US,
      ...auth_en_US
    }
  },
  vi: {
    translation: {
      ...home_vi_VN,
      ...cart_vi_VN,
      ...profile_vi_VN,
      ...auth_vi_VN
    }
  }
}
