export async function fetchDevices(){
    try{
        const response = await fetch('/api/devices');
        if(!response.ok){
            throw new Error(`HTTP error status: ${response.status}`);
        }
        // サーバから帰ってきたjson形式のデータをdevicesに代入
        const devices = await response.json();
        return devices;
    }catch(error){
        console.error('端末データの取得に失敗しました', error);
        return null;
    }
}