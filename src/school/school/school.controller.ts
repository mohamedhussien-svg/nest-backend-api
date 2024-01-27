import { Controller, Delete, Post } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { Subject } from './subject.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Teacher } from './teacher.entity';

@Controller('/school')
export class SchoolController {
  constructor(@InjectRepository(Subject) private readonly subjectRepo: Repository<Subject>,
              @InjectRepository(Teacher) private readonly teacherRepo: Repository<Teacher>) {
  }

  @Post()
  async createSubjectWithTeachers() {
    // const subject: Subject = new Subject();
    // subject.name = 'Java';
    //
    // const teacher1: Teacher = new Teacher();
    // teacher1.name = 'Mohamed';
    // const teacher2: Teacher = new Teacher();
    // teacher2.name = 'Hussein';
    // const teachers: Teacher[] = [teacher1, teacher2];
    // subject.teachers = teachers;
    // return await this.subjectRepo.save(subject);
    const subject: Subject = await this.subjectRepo.findOne({ where: { id: 3 } });
    const teachers: Teacher[] = await this.teacherRepo.findBy({
      id: In([5, 6])
    });
    await this.subjectRepo.createQueryBuilder('s')
      .relation(Subject, 'teachers')
      .of(subject)
      .add(teachers);

  }

  @Delete()
  async deleteSubjectWithTeachers() {
    // const subject = await this.subjectRepo.findOne({ where: { id: 1 }, relations: ['teachers'] });
    // subject.teachers = subject.teachers.filter(x => x.id !== 2);
    // return await this.subjectRepo.save(subject);

    await this.subjectRepo.createQueryBuilder('s')
      .update()
      .set({ name: 'Confidential' })
      .execute();

  }
}
