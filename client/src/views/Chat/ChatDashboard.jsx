import ChatDashboardWrap from './components/Layouts/ChatDashboardWrap'
import SendFeedBack from './components/SendFeedBack'
import SummaryBox from './partials/SummaryBox'
import { useEffect, useState } from 'react'
import ChatHeadAudio from './components/Layouts/ChatHeadAudio'
import { modalData } from '../../configs/constants'
import { getFromLocalStorage } from '../../hooks/helpers'
import { atomToken } from '../../configs/states/atomState'
import { useAtom } from 'jotai'
import { axiosPOST } from '../../hooks/axiosMethods'
import toast from 'react-hot-toast'
import ReactResponseModal from './partials/ReactResponseModal'

const ChatDashboard = () => {

    // global
    const [token] = useAtom(atomToken);

    // states
    const [textContent, setTextContent] = useState([]);
    const [textbox, setTextbox] = useState({ propertyOne: '', propertyTwo: '', propertyThree: '', propertyFour: '', propertyFive: '' });
    const [apiCallSuccess, setApiCalSuccess] = useState(false);

    const [loading, setLoading] = useState('');

    const [selectedModal, setSelectedModal] = useState(null);
    const [modalShow, setModalShow] = useState(false);

    // handler
    const handleShow = (modalId) => {
        setModalShow(true);
        setSelectedModal(modalId);
    };
    const handleClose = () => setModalShow(false);

    // setting state after success api
    useEffect(() => {

        const data = JSON.parse(getFromLocalStorage('responses'));

        if (textContent.length) {
            setTextbox({
                propertyOne: textContent[0],
                propertyTwo: textContent[1],
                propertyThree: textContent[2],
                propertyFour: textContent[3],
                propertyFive: textContent[4],
            })
        } else if (data && data.length) {
            setTextbox({
                propertyOne: data[0],
                propertyTwo: data[1],
                propertyThree: data[2],
                propertyFour: data[3],
                propertyFive: data[4],
            })
        } else {
            setTextContent([]);
        }
    }, [textContent])

    // feedback api
    const sendFeedbackAPI = async (feedback, setFeedback, handleClose) => {

        if (!feedback.length) {
            toast.error('Give the feedback input!');
            return
        }

        try {
            // getting data
            const getPOST = await axiosPOST('feedback', { feedback }, setLoading, token);

            // if success
            if (getPOST.success) {
                setFeedback('');
                toast.success(getPOST.message);
                handleClose();
            }

        } catch (error) {
            setLoading(false);
            toast.error(`${error.response.data.message}`);
        }
    }

    return (
        <ChatDashboardWrap>

            <div className="app-container">

                <ChatHeadAudio
                    setTextContent={setTextContent}
                    apiCallSuccess={apiCallSuccess}
                    setApiCalSuccess={setApiCalSuccess}
                />

                <SummaryBox
                    label='Hulpvraag patiënt (of contactreden)'
                    id='textbox1'
                    value={textbox.propertyOne}
                    apiCallSuccess={apiCallSuccess}
                    handleShow={handleShow}
                    modalId='feedbackModal1'
                />

                <SummaryBox
                    label='Functioneringsproblemen en beloop'
                    id='textbox2'
                    value={textbox.propertyTwo}
                    apiCallSuccess={apiCallSuccess}
                    handleShow={handleShow}
                    modalId='feedbackModal2'
                />

                <SummaryBox
                    label='Medische gezondheidsdeterminanten'
                    id='textbox3'
                    value={textbox.propertyThree}
                    apiCallSuccess={apiCallSuccess}
                    handleShow={handleShow}
                    modalId='feedbackModal3'
                />

                <SummaryBox
                    label='Omgevingsdeterminanten'
                    id='textbox4'
                    value={textbox.propertyFour}
                    apiCallSuccess={apiCallSuccess}
                    handleShow={handleShow}
                    modalId='feedbackModal4'
                />

                <SummaryBox
                    label='Persoonlijke determinanten'
                    id='textbox5'
                    value={textbox.propertyFive}
                    apiCallSuccess={apiCallSuccess}
                    handleShow={handleShow}
                    modalId='feedbackModal5'
                />
            </div>

            {/* feed back modal */}
            {modalData.map((modal) => (
                <ReactResponseModal
                    key={modal.id}
                    title={modal.title}
                    loading={loading}
                    sendFeedbackAPI={sendFeedbackAPI}
                    handleClose={handleClose}
                    show={modalShow && modal.id === selectedModal}
                    modalId={modal.id}
                />
            ))}

            {/* send feedback */}
            <SendFeedBack
                loading={loading}
                sendFeedbackAPI={sendFeedbackAPI}
            />
        </ChatDashboardWrap>
    )
}

export default ChatDashboard