import { envData } from './../App';

const STATUS_OK = 200

const get = async (url, jwtToken) => {
  const getResult = await fetch(`${envData.apiURL}${url}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwtToken}`
    },
  })
  const readableResult = await getResult.json()

  console.log("url ", url)
  console.log('get response code : ' + readableResult.code)
  console.log('get response message : ' + readableResult.message)
  console.log('get response data : ' + readableResult.data)
  if (getResult.status === STATUS_OK) {
    return readableResult.data
  }
  throw `Get request error : code=${readableResult.code}, message=${readableResult.message}, data=${readableResult.data}`
}

const post = async (url, jwtToken, data) => {
  const postResult = await fetch(`${envData.apiURL}${url}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwtToken}`
    },
    body: JSON.stringify(data)
  })
  const readableResult = await postResult.json()

  console.log('post response code : ' + readableResult.code)
  console.log('post response message : ' + readableResult.message)
  console.log('post response data : ' + readableResult.data)
  if (postResult.status === STATUS_OK) {
    return readableResult.data
  }
  throw `Post request error : code=${readableResult.code}, message=${readableResult.message}, data=${readableResult.data}`
}

const put = async (url, jwtToken, data) => {
  const postResult = await fetch(`${envData.apiURL}${url}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwtToken}`
    },
    body: JSON.stringify(data)
  })
  const readableResult = await postResult.json()

  console.log('post response code : ' + readableResult.code)
  console.log('post response message : ' + readableResult.message)
  console.log('post response data : ' + readableResult.data)
  if (postResult.status === STATUS_OK) {
    return readableResult.data
  }
  throw `Post request error : code=${readableResult.code}, message=${readableResult.message}, data=${readableResult.data}`
}

const deleteReq = async (url, jwtToken, data) => {
  const postResult = await fetch(`${envData.apiURL}${url}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwtToken}`
    },
    body: JSON.stringify(data)
  })
  const readableResult = await postResult.json()

  console.log('post response code : ' + readableResult.code)
  console.log('post response message : ' + readableResult.message)
  console.log('post response data : ' + readableResult.data)
  if (postResult.status === STATUS_OK) {
    return readableResult.data
  }
  throw `Post request error : code=${readableResult.code}, message=${readableResult.message}, data=${readableResult.data}`
}

export { get, post, put, deleteReq };