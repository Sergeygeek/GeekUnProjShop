class Carousel {
    constructor(source, container, imgContainer) {
        this.source = source;
        this.container = container;
        this.imgContainer = imgContainer;
        this.images = [];
        this.curImg = 0;
        this._init(source);
    }
    _init(source) {
        fetch(source)
            .then(result => result.json())
            .then(data => {
                for(let img of data) {
                    this.images.push(img);
                }
                this._renderImg();
            })
    }
    _renderImg() {
        let src = this.images[this.curImg].src;

        $(this.imgContainer).attr("src", src);

        $(this.container).click((e) => {
            e.preventDefault();        
            if(e.target.classList.contains('left') || e.target.classList.contains('fa-angle-left')){
                this.curImg = this.curImg - 1;
                this._prevImg();
            } else if (e.target.classList.contains('right') || e.target.classList.contains('fa-angle-right')){
                this.curImg = this.curImg + 1;
                this._nextImg();
            } else {
                return
            }
        }) 
    }
    _nextImg(){
        if (this.curImg === this.images.length) {
            this.curImg = 0;
            let src = this.images[this.curImg].src;
            $(this.imgContainer).attr("src", src);
        } else {
            let src = this.images[this.curImg].src;
            $(this.imgContainer).attr("src", src);
        }
    }
    _prevImg(){
        if (this.curImg === -1) {
            this.curImg = this.images.length - 1;
            let src = this.images[this.curImg].src;
            $(this.imgContainer).attr("src", src);
        } else {
            let src = this.images[this.curImg].src;
            $(this.imgContainer).attr("src", src);
        }   
    }
}