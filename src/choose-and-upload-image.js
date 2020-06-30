import uploadFile from './upload-file';

/**
 * 选择并上传图片到腾讯云COS（需要调用云函数签名，请先配置好云函数）
 * @async
 * @return {Promise<string>} 返回成功上传到COS上的文件名称
 */
export default function chooseAndUploadImage() {
  return new Promise(async (resolve, reject) => {
    let [error, res] = await uni.chooseImage({
      count: 1,
    });
    if (error) {
      reject(error);
      return;
    }
    // #ifdef H5
    if (!/^image/.test(res.tempFiles[0].type)) {
      reject(new Error('文件类型错误'));
      return;
    }
    // #endif
    uni.showLoading({
      mask: true,
    });
    try {
      let file = res.tempFilePaths[0];
      // #ifdef H5
      file = res.tempFiles[0];
      // #endif
      const key = await uploadFile(file);
      resolve(key);
    } catch (error) {
      reject(error);
    } finally {
      uni.hideLoading();
    }
  });
};
