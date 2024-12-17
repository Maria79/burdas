const FooterMap = () => {
  return (
    <div className="max-w-xl w-full mx-auto">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13922.962728404978!2d-16.715939852379627!3d28.366656159401137!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xc41ca683d8f4101%3A0xa54a9f2dc1d420b0!2sCalle%20Fray%20Crist%C3%B3bal%20Oramas%2C%2074%2C%20Icod%20de%20los%20Vinos%2C%20Santa%20Cruz%20de%20Tenerife%2C%20Spain!5e0!3m2!1sen!2sus!4v1696528172820!5m2!1sen!2sus"
        width="100%"
        height="250"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
};

export default FooterMap;
