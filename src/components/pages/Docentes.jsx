import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import supabase from '../../conexionDatabase';

Modal.setAppElement('#root');

function Docentes() {
  const [docentes, setDocentes] = useState([]);
  const [editingDocente, setEditingDocente] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDocente, setNewDocente] = useState({
    apellido_nombre: '',
    dni: '',
    cuil: '',
    celular: '',
    correo_abc: '',
    fecha_nacimiento: '',
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Fetch docentes on component mount
  useEffect(() => {
    const fetchDocentes = async () => {
      const { data, error } = await supabase
        .from('profesores')
        .select('*')
        .order('apellido_nombre', { ascending: true });

      if (error) {
        console.error('Error fetching docentes:', error);
      } else {
        setDocentes(data);
      }
    };

    fetchDocentes();
  }, []);

  const handleEdit = (docente) => {
    setEditingDocente(docente);
    setIsModalOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingDocente((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    const { error } = await supabase
      .from('profesores')
      .update(editingDocente)
      .eq('id', editingDocente.id);

    if (error) {
      console.error('Error updating docente:', error);
    } else {
      setEditingDocente(null);
      setIsModalOpen(false);
      const { data } = await supabase
        .from('profesores')
        .select('*')
        .order('apellido_nombre', { ascending: true });
      setDocentes(data);
    }
  };

  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setNewDocente((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveNewDocente = async () => {
    const { error } = await supabase
      .from('profesores')
      .insert(newDocente);

    if (error) {
      console.error('Error creating docente:', error);
    } else {
      setNewDocente({
        apellido_nombre: '',
        dni: '',
        cuil: '',
        celular: '',
        correo_abc: '',
        fecha_nacimiento: '',
      });
      setIsCreateModalOpen(false);
      const { data } = await supabase
        .from('profesores')
        .select('*')
        .order('apellido_nombre', { ascending: true });
      setDocentes(data);
    }
  };

  const handleCreate = () => {
    setIsCreateModalOpen(true);
  };

  return (
    <div style={{ backgroundColor: '#F5F5F5', padding: '20px', minHeight: '100vh' }}>
      <h1>Docentes</h1>
      <button
        onClick={handleCreate}
        style={{
          padding: '10px',
          backgroundColor: '#1976D2',
          color: '#FFFFFF',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginBottom: '20px',
        }}
      >
        Crear Nuevo Docente
      </button>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          backgroundColor: '#FFFFFF',
          borderRadius: '10px',
          overflow: 'hidden',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <thead>
          <tr style={{ backgroundColor: '#1976D2', color: '#FFFFFF' }}>
            <th style={{ padding: '10px', textAlign: 'left' }}>ID</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Apellido y Nombre</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>DNI</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>CUIL</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Celular</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Correo ABC</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Fecha de Nacimiento</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {docentes.map((docente) => (
            <tr key={docente.id} style={{ backgroundColor: '#E1F5FE', color: '#000000' }}>
              <td style={{ padding: '10px' }}>{docente.id}</td>
              <td style={{ padding: '10px' }}>{docente.apellido_nombre}</td>
              <td style={{ padding: '10px' }}>{docente.dni}</td>
              <td style={{ padding: '10px' }}>{docente.cuil}</td>
              <td style={{ padding: '10px' }}>{docente.celular}</td>
              <td style={{ padding: '10px' }}>{docente.correo_abc}</td>
              <td style={{ padding: '10px' }}>{docente.fecha_nacimiento}</td>
              <td style={{ padding: '10px' }}>
                <button
                  onClick={() => handleEdit(docente)}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: '#1976D2',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                  }}
                >
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de edición */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '50%',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        {editingDocente && (
          <div>
            <h3>Editar Docente</h3>
            {/* Formulario de edición */}
            <label style={{ display: 'block', marginBottom: '10px' }}>
              Apellido y Nombre:
              <input
                type="text"
                name="apellido_nombre"
                value={editingDocente.apellido_nombre}
                onChange={handleEditChange}
                style={{ width: '100%', padding: '8px', borderRadius: '5px', marginTop: '5px' }}
              />
            </label>
            <label style={{ display: 'block', marginBottom: '10px' }}>
              DNI:
              <input
                type="text"
                name="dni"
                value={editingDocente.dni}
                onChange={handleEditChange}
                style={{ width: '100%', padding: '8px', borderRadius: '5px', marginTop: '5px' }}
              />
            </label>
            <label style={{ display: 'block', marginBottom: '10px' }}>
              CUIL:
              <input
                type="text"
                name="cuil"
                value={editingDocente.cuil}
                onChange={handleEditChange}
                style={{ width: '100%', padding: '8px', borderRadius: '5px', marginTop: '5px' }}
              />
            </label>
            <label style={{ display: 'block', marginBottom: '10px' }}>
              Celular:
              <input
                type="text"
                name="celular"
                value={editingDocente.celular}
                onChange={handleEditChange}
                style={{ width: '100%', padding: '8px', borderRadius: '5px', marginTop: '5px' }}
              />
            </label>
            <label style={{ display: 'block', marginBottom: '10px' }}>
              Correo ABC:
              <input
                type="text"
                name="correo_abc"
                value={editingDocente.correo_abc}
                onChange={handleEditChange}
                style={{ width: '100%', padding: '8px', borderRadius: '5px', marginTop: '5px' }}
              />
            </label>
            <label style={{ display: 'block', marginBottom: '10px' }}>
              Fecha de Nacimiento:
              <input
                type="date"
                name="fecha_nacimiento"
                value={editingDocente.fecha_nacimiento}
                onChange={handleEditChange}
                style={{ width: '100%', padding: '8px', borderRadius: '5px', marginTop: '5px' }}
              />
            </label>
            <button
              onClick={handleSaveChanges}
              style={{ width: '100%', padding: '10px', backgroundColor: '#1976D2', color: '#FFFFFF', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' }}
            >
              Guardar Cambios
            </button>

          </div>
        )}
      </Modal>

      {/* Modal de creación */}
      <Modal
        isOpen={isCreateModalOpen}
        onRequestClose={() => setIsCreateModalOpen(false)}
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '50%',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        <div>
          <h3>Crear Nuevo Docente</h3>
          {/* Formulario de creación */}
          <label style={{ display: 'block', marginBottom: '10px' }}>
          Apellido y Nombre:
          <input
            type="text"
            name="apellido_nombre"
            value={newDocente.apellido_nombre}
            onChange={handleCreateChange}
            style={{ width: '100%', padding: '8px', borderRadius: '5px', marginTop: '5px' }}
          />
        </label>
        <label style={{ display: 'block', marginBottom: '10px' }}>
          DNI:
          <input
            type="text"
            name="dni"
            value={newDocente.dni}
            onChange={handleCreateChange}
            style={{ width: '100%', padding: '8px', borderRadius: '5px', marginTop: '5px' }}
          />
        </label>
        <label style={{ display: 'block', marginBottom: '10px' }}>
          CUIL:
          <input
            type="text"
            name="cuil"
            value={newDocente.cuil}
            onChange={handleCreateChange}
            style={{ width: '100%', padding: '8px', borderRadius: '5px', marginTop: '5px' }}
          />
        </label>
        <label style={{ display: 'block', marginBottom: '10px' }}>
          Celular:
          <input
            type="text"
            name="celular"
            value={newDocente.celular}
            onChange={handleCreateChange}
            style={{ width: '100%', padding: '8px', borderRadius: '5px', marginTop: '5px' }}
          />
        </label>
        <label style={{ display: 'block', marginBottom: '10px' }}>
          Correo ABC:
          <input
            type="text"
            name="correo_abc"
            value={newDocente.correo_abc}
            onChange={handleCreateChange}
            style={{ width: '100%', padding: '8px', borderRadius: '5px', marginTop: '5px' }}
          />
        </label>
        <label style={{ display: 'block', marginBottom: '10px' }}>
          Fecha de Nacimiento:
          <input
            type="date"
            name="fecha_nacimiento"
            value={newDocente.fecha_nacimiento}
            onChange={handleCreateChange}
            style={{ width: '100%', padding: '8px', borderRadius: '5px', marginTop: '5px' }}
          />
        </label>
        <button
          onClick={handleSaveNewDocente}
          style={{ width: '100%', padding: '10px', backgroundColor: '#1976D2', color: '#FFFFFF', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' }}
        >
          Guardar Cambios
        </button>

        </div>
      </Modal>
    </div>
  );
}

export default Docentes;


/* ORIGINAL
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import supabase from '../../conexionDatabase';

Modal.setAppElement('#root');

function Docentes() {
  const [docentes, setDocentes] = useState([]);
  const [editingDocente, setEditingDocente] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchDocentes = async () => {
      const { data, error } = await supabase
        .from('profesores')
        .select('*')
        .order('apellido_nombre', { ascending: true });

      if (error) {
        console.error('Error fetching docentes:', error);
      } else {
        setDocentes(data);
      }
    };

    fetchDocentes();
  }, []);

  const handleEdit = (docente) => {
    setEditingDocente(docente);
    setIsModalOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingDocente((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    const { error } = await supabase
      .from('profesores')
      .update(editingDocente)
      .eq('id', editingDocente.id);

    if (error) {
      console.error('Error updating docente:', error);
    } else {
      setEditingDocente(null);
      setIsModalOpen(false);
      const { data } = await supabase
        .from('profesores')
        .select('*')
        .order('apellido_nombre', { ascending: true });
      setDocentes(data);
    }
  };

  const handleCreate = () => {
    console.log('Create new docente');
  };

  return (
    <div style={{ backgroundColor: '#F5F5F5', padding: '20px', minHeight: '100vh' }}>
      <h1>Docentes</h1>
      <button
        onClick={handleCreate}
        style={{ padding: '10px', backgroundColor: '#1976D2', color: '#FFFFFF', border: 'none', borderRadius: '5px', cursor: 'pointer', marginBottom: '20px' }}
      >
        Crear Nuevo Docente
      </button>
      <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#FFFFFF', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
        <thead>
          <tr style={{ backgroundColor: '#1976D2', color: '#FFFFFF' }}>
            <th style={{ padding: '10px', textAlign: 'left' }}>ID</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Apellido y Nombre</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>DNI</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>CUIL</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Celular</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Correo ABC</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Fecha de Nacimiento</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {docentes.map((docente) => (
            <tr key={docente.id} style={{ backgroundColor: '#E1F5FE', color: '#000000' }}>
              <td style={{ padding: '10px' }}>{docente.id}</td>
              <td style={{ padding: '10px' }}>{docente.apellido_nombre}</td>
              <td style={{ padding: '10px' }}>{docente.dni}</td>
              <td style={{ padding: '10px' }}>{docente.cuil}</td>
              <td style={{ padding: '10px' }}>{docente.celular}</td>
              <td style={{ padding: '10px' }}>{docente.correo_abc}</td>
              <td style={{ padding: '10px' }}>{docente.fecha_nacimiento}</td>
              <td style={{ padding: '10px' }}>
                <button
                  onClick={() => handleEdit(docente)}
                  style={{ padding: '5px 10px', backgroundColor: '#1976D2', color: '#FFFFFF', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '50%',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        {editingDocente && (
          <div>
            <h3>Editar Docente</h3>
            <label style={{ display: 'block', marginBottom: '10px' }}>
              Apellido y Nombre:
              <input
                type="text"
                name="apellido_nombre"
                value={editingDocente.apellido_nombre}
                onChange={handleEditChange}
                style={{ width: '100%', padding: '8px', borderRadius: '5px', marginTop: '5px' }}
              />
            </label>
            <label style={{ display: 'block', marginBottom: '10px' }}>
              DNI:
              <input
                type="text"
                name="dni"
                value={editingDocente.dni}
                onChange={handleEditChange}
                style={{ width: '100%', padding: '8px', borderRadius: '5px', marginTop: '5px' }}
              />
            </label>
            <label style={{ display: 'block', marginBottom: '10px' }}>
              CUIL:
              <input
                type="text"
                name="cuil"
                value={editingDocente.cuil}
                onChange={handleEditChange}
                style={{ width: '100%', padding: '8px', borderRadius: '5px', marginTop: '5px' }}
              />
            </label>
            <label style={{ display: 'block', marginBottom: '10px' }}>
              Celular:
              <input
                type="text"
                name="celular"
                value={editingDocente.celular}
                onChange={handleEditChange}
                style={{ width: '100%', padding: '8px', borderRadius: '5px', marginTop: '5px' }}
              />
            </label>
            <label style={{ display: 'block', marginBottom: '10px' }}>
              Correo ABC:
              <input
                type="text"
                name="correo_abc"
                value={editingDocente.correo_abc}
                onChange={handleEditChange}
                style={{ width: '100%', padding: '8px', borderRadius: '5px', marginTop: '5px' }}
              />
            </label>
            <label style={{ display: 'block', marginBottom: '10px' }}>
              Fecha de Nacimiento:
              <input
                type="date"
                name="fecha_nacimiento"
                value={editingDocente.fecha_nacimiento}
                onChange={handleEditChange}
                style={{ width: '100%', padding: '8px', borderRadius: '5px', marginTop: '5px' }}
              />
            </label>
            <button
              onClick={handleSaveChanges}
              style={{ width: '100%', padding: '10px', backgroundColor: '#1976D2', color: '#FFFFFF', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' }}
            >
              Guardar Cambios
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Docentes;
const [newDocente, setNewDocente] = useState({
  apellido_nombre: '',
  dni: '',
  cuil: '',
  celular: '',
  correo_abc: '',
  fecha_nacimiento: '',
});
const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

const handleCreateChange = (e) => {
  const { name, value } = e.target;
  setNewDocente((prev) => ({ ...prev, [name]: value }));
};

const handleSaveNewDocente = async () => {
  const { error } = await supabase
    .from('profesores')
    .insert(newDocente);

  if (error) {
    console.error('Error creating docente:', error);
  } else {
    setNewDocente({
      apellido_nombre: '',
      dni: '',
      cuil: '',
      celular: '',
      correo_abc: '',
      fecha_nacimiento: '',
    });
    setIsCreateModalOpen(false);
    const { data } = await supabase
      .from('profesores')
      .select('*')
      .order('apellido_nombre', { ascending: true });
    setDocentes(data);
  }
};

const handleCreate = () => {
  setIsCreateModalOpen(true);
};

<Modal
  isOpen={isCreateModalOpen}
  onRequestClose={() => setIsCreateModalOpen(false)}
  style={{
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '50%',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
  }}
>
  <div>
    <h3>Crear Nuevo Docente</h3>
    <label style={{ display: 'block', marginBottom: '10px' }}>
      Apellido y Nombre:
      <input
        type="text"
        name="apellido_nombre"
        value={newDocente.apellido_nombre}
        onChange={handleCreateChange}
        style={{ width: '100%', padding: '8px', borderRadius: '5px', marginTop: '5px' }}
      />
    </label>
    <label style={{ display: 'block', marginBottom: '10px' }}>
      DNI:
      <input
        type="text"
        name="dni"
        value={newDocente.dni}
        onChange={handleCreateChange}
        style={{ width: '100%', padding: '8px', borderRadius: '5px', marginTop: '5px' }}
      />
    </label>
    <label style={{ display: 'block', marginBottom: '10px' }}>
      CUIL:
      <input
        type="text"
        name="cuil"
        value={newDocente.cuil}
        onChange={handleCreateChange}
        style={{ width: '100%', padding: '8px', borderRadius: '5px', marginTop: '5px' }}
      />
    </label>
    <label style={{ display: 'block', marginBottom: '10px' }}>
      Celular:
      <input
        type="text"
        name="celular"
        value={newDocente.celular}
        onChange={handleCreateChange}
        style={{ width: '100%', padding: '8px', borderRadius: '5px', marginTop: '5px' }}
      />
    </label>
    <label style={{ display: 'block', marginBottom: '10px' }}>
      Correo ABC:
      <input
        type="text"
        name="correo_abc"
        value={newDocente.correo_abc}
        onChange={handleCreateChange}
        style={{ width: '100%', padding: '8px', borderRadius: '5px', marginTop: '5px' }}
      />
    </label>
    <label style={{ display: 'block', marginBottom: '10px' }}>
      Fecha de Nacimiento:
      <input
        type="date"
        name="fecha_nacimiento"
        value={newDocente.fecha_nacimiento}
        onChange={handleCreateChange}
        style={{ width: '100%', padding: '8px', borderRadius: '5px', marginTop: '5px' }}
      />
    </label>
    <button
      onClick={handleSaveNewDocente}
      style={{ width: '100%', padding: '10px', backgroundColor: '#1976D2', color: '#FFFFFF', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' }}
    >
      Guardar Cambios
    </button>
  </div>
</Modal>
*/
