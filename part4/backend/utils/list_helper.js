const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs)=>{
    if (blogs == null || blogs.length == null){
        return 0
    }

    return blogs.reduce((sum,item)=>{
       return sum + item.likes
    },0)
}

module.exports = {
    dummy,totalLikes
}