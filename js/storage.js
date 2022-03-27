var storage = {
    saveRememberMe(isRemember){
        localStorage.setItem("isRemember", isRemember);
    },
    getRememberMe(){
        if(localStorage.getItem("isRemember") == null){
            return true;
        }
        return JSON.parse(localStorage.getItem("isRemember").toLowerCase());
    },
    setItem(key, value){
        if(this.getRememberMe()){
            localStorage.setItem(key, value);
        }else{
            sessionStorage.setItem(key, value);
        }
    },
    getItem(key){
        return this.getRememberMe() ? localStorage.getItem(key) : sessionStorage.getItem(key);
    },
    removeItem(key){
        return this.getRememberMe() ? localStorage.removeItem(key) : sessionStorage.removeItem(key);
    }
}