export async function fetchData(url){
    try{
        let response = await fetch(url)
        if(!response.ok) return null

        let data = await response.json()
        return data
    }
    catch(error){
        console.log("error")
        return null
    }
}