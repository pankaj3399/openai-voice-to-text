import { checkpoints } from "../../../configs/constants"


const Voordelen = () => {
    return (
        <section id="voordelen" className="course-include-section">
            <div className="course-includes-background"></div>
            <div className="custom-container">
                <div className="w-layout-grid two-column-grid">
                    <div
                        data-aos="fade-right"
                        id="w-node-_5b273204-eab4-75f5-b636-fa663ee7fdf3-cf4aff70"
                        data-w-id="5b273204-eab4-75f5-b636-fa663ee7fdf3"
                        // style={{ opacity: 0 }}
                        className="image-wrapper course-include-image-wrapper"
                    >
                        <img
                            src="/images/vrouw_laptop-1.webp"
                            loading="lazy"
                            width="566"
                            sizes="(max-width: 479px) 90vw, (max-width: 767px) 400px, (max-width: 991px) 100vw, (max-width: 1279px) 96vw, 1140px"
                            alt=""
                            srcSet="/images/vrouw_laptop-500.png 500w, /images/vrouw_laptop-800.png 800w, /images/vrouw_laptop-1080.png 1080w, /images/vrouw_laptop-1.webp 1132w"
                            className="course-banner-image"
                        />

                        <div
                            data-w-id="7523990f-10a1-0a8f-7409-361b6812eedf"
                            className="course-include-card-wrapper resources-card"
                        >
                            <div className="course-include-card resource">
                                <div className="resource-card-title">1</div>
                                <img
                                    src="/images/1-minute-card.webp"
                                    loading="lazy"
                                    width="70"
                                    alt=""
                                    className="resource-card-image"
                                />
                                <div className="course-include-card-title">Start binnen<br />1 minuut</div>
                                <div className="circle-wrapper">
                                    <div className="resource-card-circle"></div>
                                    <div className="resource-card-circle"></div>
                                    <div className="resource-card-circle"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                    data-aos="fade-left"
                        id="w-node-_53e795a1-4f68-ad5d-1c4e-8a8ee1a1afef-cf4aff70"
                        data-w-id="53e795a1-4f68-ad5d-1c4e-8a8ee1a1afef"
                        // style={{ opacity: 0 }}
                        className="course-details-contents"
                    >
                        <h2 className="heading">De voordelen van Fysio.ai </h2>
                        <p className="default-paragraph">
                            Fysio.ai versterkt jouw praktijk met AI-gestuurde precisie, die gesprekken omzet
                            in duidelijke data. Ervaar hoe onze technologie tijd bespaart en jou in staat stelt om je volledig op de
                            patiënt te richten.
                        </p>

                        <div className="checkpoint-wrapper">
                            {checkpoints.map((checkpoint, index) => (
                                <div key={index} className="checkpoint-block">
                                    <div className="check-icon" style={{ position: 'relative', top: '3px' }}>{checkpoint.icon}</div>
                                    <div dangerouslySetInnerHTML={{ __html: checkpoint.text }} />
                                </div>
                            ))}
                        </div>

                        <a href="#contact" data-w-id="3f5dab86-cc03-f077-5a0c-e7d1e4693d4f"
                            className="primary-button border-on-hover w-inline-block">
                            <div>Kom in Contact</div>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Voordelen