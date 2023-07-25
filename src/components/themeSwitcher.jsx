function ThemeSwitcher(){
    let media = window.matchMedia("(prefers-color-scheme:dark)");
    console.log(media.matches)
    if(media.matches){
        document.documentElement.dataset.theme="dark"
    }
    function switchTheme() {
        let checkBox = document.getElementById("theme")
        if(checkBox.checked===false){
            document.documentElement.dataset.theme="dark"
        }else{
            document.documentElement.dataset.theme="light"
        }
    }
    return(
        <div className="themeSwitcher">
            <input type="checkbox" id='theme'/>
            <label htmlFor="theme" className="costumeCheckBox" onClick={switchTheme}></label>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width={22}
                height={22}
                viewBox="0 0 22 22"
                >
                <path
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M1 10.449a10.544 10.544 0 0019.993 4.686C11.544 15.135 6.858 10.448 6.858 1A10.545 10.545 0 001 10.449z"
                />
            </svg>        
    </div>
    )
} 

export {ThemeSwitcher}