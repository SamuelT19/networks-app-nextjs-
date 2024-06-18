export const setUserInLocalStorage = (user: any, expiryInHours = 24) => {
    const now = new Date();
    const item = {
      user,
      expiry: now.getTime() + expiryInHours * 3600 * 1000, 
    };
    localStorage.setItem("user", JSON.stringify(item));
  };



export const getUserFromLocalStorage = () => {
    if (typeof window !== "undefined") {
      const itemStr = localStorage.getItem("user");
      if (!itemStr) {
        return null;
      }
      const item = JSON.parse(itemStr);
      const now = new Date();
      if (now.getTime() > item.expiry) {
        localStorage.removeItem("user");
        return null;
      }
      return item.user;
    }
    return null;
  };
  
  


  