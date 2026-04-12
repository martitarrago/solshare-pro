import { User, Bell, FileText } from "lucide-react";

const SettingsPage = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Configuración</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Gestiona tu cuenta y preferencias</p>
      </div>

      {[
        { icon: User, title: "Perfil", desc: "Nombre, empresa y datos de contacto" },
        { icon: Bell, title: "Notificaciones", desc: "Preferencias de alertas y avisos" },
        { icon: FileText, title: "Plantillas", desc: "Personaliza tus documentos de reparto" },
      ].map((item, i) => (
        <button
          key={i}
          className="glass-card rounded-2xl p-5 w-full text-left hover-lift flex items-center gap-4 group"
        >
          <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
            <item.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <div>
            <h3 className="font-heading font-medium text-foreground">{item.title}</h3>
            <p className="text-sm text-muted-foreground">{item.desc}</p>
          </div>
        </button>
      ))}
    </div>
  );
};

export default SettingsPage;
