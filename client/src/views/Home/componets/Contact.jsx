
const Contact = () => {
    return (
        <section  id="contact" className="learning-today-section">
            <div
            data-aos="fade-up"
                data-w-id="7f0c7d40-aad9-4671-ae2c-1c1bf4d4fc8d"
                style={{
                    // opacity: 0,
                    // transform: 'translate3d(0, 50%, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0)',
                }}
                className="container"
            >
                <div className="learning-today-wrapper">
                    <h2 className="section-heading middle-allign">Vraag je demo aan 🎉</h2>
                    <p className="start-learning-paragraph">
                        Ontdek hoe fysio.ai jouw werk kan veranderen met een persoonlijke, gratis demo. Meld je aan en laat je inspireren
                        door de toekomst van fysiotherapie die voor je deur staat. Voor andere vragen, staan we je graag te woord via{' '}
                        <a href="mailto:info@fysio.ai" target="_new">
                            info@fysio.ai
                        </a>
                        .
                    </p>
                </div>

                <div className="form-block w-form">
                    <form
                        action="/request-demo"
                        id="email-form"
                        name="email-form"
                        data-name="Email Form"
                        method="post"
                        className="form"
                        data-wf-page-id="654bb294e58411b4cf4aff70"
                        data-wf-element-id="2edfefcd-8adf-6c72-6754-5938d037ba07"
                    >
                        <div>
                            <input type="email" className="text-field w-input" maxLength="256" name="email" data-name="Email" placeholder="Vul hier je e-mailadres in" id="email" required="" />
                        </div>
                        <div>
                            <input type="submit" value="Aanvragen" data-wait="Please wait..." className="primary-button border-on-hover w-button" />
                        </div>
                    </form>
                    <div className="success-message-2 w-form-done">
                        <div className="text-block-2">Bedankt! Je aanvraag is ingediend; je hoort snel van ons.</div>
                    </div>
                    <div className="w-form-fail">
                        <div>
                            Oeps! Er ging iets mis bij het versturen van het formulier. <br />
                            Stuur een e-mail naar{' '}
                            <a href="mailto:info@fysio.ai" target="_new">
                                info@fysio.ai
                            </a>
                            .
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default Contact;
