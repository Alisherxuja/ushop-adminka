import uploadComponent from './Uploader';
import UploadViewer from './UploadViewer';


export default {
    install (Vue, options) {
        Vue.component('VUploader', uploadComponent)
        Vue.component('UploadViewer', UploadViewer)
    }
}
