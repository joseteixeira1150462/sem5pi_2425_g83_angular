import { TestBed } from '@angular/core/testing';
import { PatientService } from './patient.service';
import { PatientRepository } from '../../infrastructure/repositories/Patient.repository';
import { CreatePatient } from '../../domain/models/Patient/CreatePatient.model';
import { of } from 'rxjs';

describe('PatientService', () => {
  let service: PatientService;
  let repoMock: jasmine.SpyObj<PatientRepository>;

  beforeEach(() => {
    // Criação do mock do PatientRepository
    const mockRepo = jasmine.createSpyObj('PatientRepository', ['createPatient']);

    TestBed.configureTestingModule({
      providers: [
        PatientService,
        { provide: PatientRepository, useValue: mockRepo }
      ]
    });

    service = TestBed.inject(PatientService);
    repoMock = TestBed.inject(PatientRepository) as jasmine.SpyObj<PatientRepository>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call createPatient on the repository with correct parameters', () => {
    // Objeto simulado
    const newPatient: CreatePatient = {
      firstName: 'John',
      lastName: 'Doe',
      birthDate: new Date('1990-01-01T00:00:00Z'),
      gender: 'Male',
      email: 'johndoe@example.com',
      phone: '+12 123456789',
      emergencyPhone: '+351 098765431',
    };

    const createdPatient: CreatePatient = { ...newPatient };

    // Simula o retorno do método do repositório
    repoMock.createPatient.and.returnValue(of(createdPatient));

    // Chama o método do serviço
    service.createPatient(newPatient).subscribe((result) => {
      expect(result).toEqual(createdPatient); // Verifica se o resultado está correto
    });

    // Verifica se o método do repositório foi chamado com os parâmetros corretos
    expect(repoMock.createPatient).toHaveBeenCalledWith(newPatient);
    expect(repoMock.createPatient).toHaveBeenCalledTimes(1);
  });
});
