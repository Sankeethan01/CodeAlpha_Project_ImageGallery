const imagesWrapper=document.querySelector(".images")
const loadmorebtn=document.querySelector(".load-more")
const searchinput=document.querySelector(".search-box input")
const searchbtn=document.querySelector('.search-btn')
const lightbox=document.querySelector(".lightbox")
const closeBtn=lightbox.querySelector(".fa-xmark")
const downloadImageBtn=lightbox.querySelector(".fa-download")


const apiKey="O4H09QxstuBGz9zABDWCiXzoRcYwjmDYNfVqAZ88w6WoigP3XvXVZ7U2"
const perPage=20
let currentPage=1
let searchTerm=null

const downloadImg=(imgURL)=>{
     fetch(imgURL).then(res=>res.blob()).then(file=>{
        const a=document.createElement("a")
        a.href=URL.createObjectURL(file)
        a.download=new Date().getTime()
        a.click()
     }).catch(()=>alert("Failed to download image!"))
}

const showLightBox=(name,img)=>{
    lightbox.querySelector("img").src=img
    lightbox.querySelector("span").innerText=name
    downloadImageBtn.setAttribute("data-img",img)
    lightbox.classList.add("show")
    document.body.style.overflow="hidden"
}

const closeLightBox=()=>{
    lightbox.classList.remove("show")
    document.body.style.overflow="auto"
}

const generateHTML=(images)=>{
    imagesWrapper.innerHTML+=images.map(img=>
    `<li class="card" onclick="showLightBox('${img.alt}','${img.src.large2x}')"><img src="${img.src.large2x}" alt="">
    <div class="details">
        <div class="name">
            <span>${img.alt}</span>
        </div>
        <button onclick="downloadImg('${img.src.large2x}');event.stopPropagation();"><i class="fa-solid fa-download"></i></i></i></i></button>
      </div>
</li>`).join("")
  
}

const getImages=(apiURL)=>{
      
    loadmorebtn.innerText="Loading..."
    loadmorebtn.classList.add("disabled")

    fetch(apiURL,{
        headers:{Authorization:apiKey}
    }).then(res=>res.json()).then(data=>{
        generateHTML(data.photos)
        loadmorebtn.innerText="Load More"
    loadmorebtn.classList.remove("disabled")
    }).catch(()=>alert('Failed to load images!'))
}

const loadMoreImages=()=>{
    currentPage++
    let apiURL=`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`
    apiURL=searchTerm?`https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`:apiURL
    getImages(apiURL)
}
const loadSearchImages=(e)=>{
    
    if(e.target.value==='') 
    return searchTerm=null

    if(e.key==='Enter'){
        currentPage=1
        searchTerm=e.target.value
        imagesWrapper.innerHTML=""
        getImages(`https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}`)
    }
    
}
function display(){
    if(searchTerm==="")
        return searchTerm=null

     currentPage=1
     searchTerm=searchinput.value
     imagesWrapper.innerHTML=""
        getImages(`https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}`)
}
searchbtn.addEventListener('click',display)



getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`)

loadmorebtn.addEventListener('click',loadMoreImages)
searchinput.addEventListener('keyup',loadSearchImages)
closeBtn.addEventListener('click',closeLightBox)
downloadImageBtn.addEventListener("click",(e)=>downloadImg(e.target.dataset.img))