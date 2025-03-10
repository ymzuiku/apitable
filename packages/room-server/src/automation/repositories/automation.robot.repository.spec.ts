/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutomationRobotRepository } from './automation.robot.repository';
import { AutomationRobotEntity } from '../entities/automation.robot.entity';
import { DeepPartial } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { DatabaseConfigService } from 'shared/services/config/database.config.service';

describe('AutomationRobotRepository', () => {
  let automationRobotRepository: AutomationRobotRepository;

  const theRobotResourceId = 'theRobotResourceId';
  const theRobotId = 'theRobotId';
  const theUserId = 'theUserId';
  let module: TestingModule;
  let entity: AutomationRobotEntity;

  beforeAll(async() => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRootAsync({
          useClass: DatabaseConfigService,
        }),
        TypeOrmModule.forFeature([AutomationRobotRepository]),
      ],
      providers: [AutomationRobotRepository],
    }).compile();

    automationRobotRepository = module.get<AutomationRobotRepository>(AutomationRobotRepository);
    const robot: DeepPartial<AutomationRobotEntity> = {
      resourceId: theRobotResourceId,
      robotId: theRobotId,
      name: 'robot',
      description: 'the test robot',
      isActive: true,
      createdBy: theUserId,
      updatedBy: theUserId,
    };
    const record = automationRobotRepository.create(robot);
    entity = await automationRobotRepository.save(record);
    expect(entity).toBeDefined();
  });

  afterAll(async() => {
    await automationRobotRepository.delete(entity.id);
    await automationRobotRepository.manager.connection.close();
  });

  it('should be defined', () => {
    expect(automationRobotRepository).toBeDefined();
  });

  it('given one active robot entity when get active robots by resource id', async() => {
    const resourceRobotDtos = await automationRobotRepository.getActiveRobotsByResourceIds([theRobotResourceId]);
    expect(resourceRobotDtos).toBeDefined();
    expect(resourceRobotDtos.length).toEqual(1);
    expect(resourceRobotDtos[0]!.resourceId).toEqual(theRobotResourceId);
    expect(resourceRobotDtos[0]!.robotId).toEqual(theRobotId);
  });

  it('given one active robot entity when get robot id by resource id', async() => {
    const robotIds = await automationRobotRepository.getRobotIdByResourceId(theRobotResourceId);
    expect(robotIds).toBeDefined();
    expect(robotIds.length).toEqual(1);
    expect(robotIds[0]!.robotId).toEqual(theRobotId);
  });
});
