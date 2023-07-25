function FontOptions({name, dataAttr}) {
    function changeFF(e){
        const elements = document.querySelectorAll(`${e.currentTarget.parentElement.tagName}>${e.currentTarget.tagName}`)
        const displayer = document.querySelector(`.font`)

        let font;
        if(dataAttr==="sf"){
            font="Sans Serif"
        }else if(dataAttr==="s"){
            font="Serif"
        }else{
            font="Mono"
        }
        
        elements.forEach(e=>e.classList.remove("checked"))
        e.currentTarget.classList.add("checked")
        displayer.textContent = font

        document.documentElement.style.setProperty("--FF", font)
    }
    return <p data-ff={dataAttr} onClick={changeFF}>{name}</p>
}

export {FontOptions}